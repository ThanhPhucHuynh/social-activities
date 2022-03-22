package config

import (
	"context"
	"fmt"
	"log"
	"social-activities/internal/pkg/glog"
	"strings"
	"time"

	"github.com/fsnotify/fsnotify"
	"github.com/pkg/errors"
	"github.com/spf13/viper"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type (
	State string

	Config struct {
		State      State
		HTTPServer HTTPServer `mapstructure:"http_server"`
		Database   struct {
			Type  string  `mapstructure:"type"`
			Mongo MongoDB `mapstructure:"mongo"`
		} `mapstructure:"database"`
	}

	HTTPServer struct {
		Address           string        `mapstructure:"address"`
		Port              int           `mapstructure:"port"`
		ReadTimeout       time.Duration `mapstructure:"read_timeout"`
		WriteTimeout      time.Duration `mapstructure:"write_timeout"`
		ReadHeaderTimeout time.Duration `mapstructure:"read_header_timeout"`
		ShutdownTimeout   time.Duration `mapstructure:"shutdown_timeout"`
	}

	MongoDB struct {
		Address  string        `envconfig:"MONGODB_ADDRS" mapstructure:"address"`
		Database string        `envconfig:"MONGODB_DATABASE" default:"dating" mapstructure:"database"`
		Username string        `mapstructure:"username"`
		Password string        `mapstructure:"password"`
		Timeout  time.Duration `mapstructure:"timout"`
	}
)

const (
	StageLocal State = "dev"
	StageDEV   State = "dev"
)

func ParseState(s string) State {
	switch s {
	case "local", "localhost", "l":
		return StageLocal
	case "dev", "develop", "development", "d":
		return StageDEV
	}
	return StageLocal
}

func ReadCongfig(path string, state string) (*Config, error) {
	var config Config
	stage := ParseState(state)

	vn := viper.New()
	vn.AddConfigPath(path)
	vn.SetConfigName(fmt.Sprintf("config.%s", stage))
	vn.AutomaticEnv()
	vn.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))

	if err := vn.ReadInConfig(); err != nil {
		errors.Wrap(err, "failed to read config")
		return nil, err
	}

	if errUnmarshal := config.binding(vn); errUnmarshal != nil {
		return &config, errUnmarshal
	}

	vn.OnConfigChange(func(e fsnotify.Event) {
		log.Printf("config file changed: %v", e.Name)
		if err := config.binding(vn); err != nil {
			log.Printf("binding error:", err)
		}
		log.Printf("config: %+v", config)
	})

	return &config, nil
}

func (c *Config) binding(v *viper.Viper) error {
	if err := v.Unmarshal(&c); err != nil {
		log.Printf("Failed when binding config: ", err)
		return err
	}
	return nil
}

func Dial(conf *MongoDB, logger glog.Logger) (*mongo.Client, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()
	// Set client options
	clientOptions := options.Client().ApplyURI(fmt.Sprintf("mongodb+srv://%s", conf.Address))
	// Connect to MongoDB
	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		logger.Errorf("Got an error: %v", err)
	}

	// Check the connection
	err = client.Ping(ctx, nil)

	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Connected to MongoDB!")

	logger.Infof("successfully dialing to MongoDB at %v", conf.Address)
	return client, nil
}
