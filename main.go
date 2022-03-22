package main

import (
	"flag"
	"fmt"
	"os"
	"os/signal"
	"syscall"

	"social-activities/internal/app"
	config "social-activities/internal/pkg/config"
	envconfig "social-activities/internal/pkg/envconfig"
)

func main() {
	fmt.Println("conga")

	configPath := flag.String("config", "configs", "set configs path, default as: 'configs'")
	stage := flag.String("stage", "dev", "set working environment")

	conf, err := config.ReadCongfig(*configPath, *stage)
	if err != nil {
		fmt.Println(err)

	}

	// error message
	em := config.ErrorMessage{ConfigPath: *configPath}
	if err := em.Init(); err != nil {
		fmt.Println(err)
	}

	fmt.Println(conf.HTTPServer.Port)

	var mongoConf config.MongoDB
	envconfig.Load(&mongoConf)
	if mongoConf.Address != "" {
		conf.Database.Mongo.Address = mongoConf.Address
	}

	if mongoConf.Database != "" {
		conf.Database.Mongo.Database = mongoConf.Database
	}

	serv, err := app.Init(conf, em)
	if err != nil {
		fmt.Println(err)
	}
	defer serv.Stop()

	go func() {
		serv.Start()
	}()

	stopChan := make(chan os.Signal, 2)
	signal.Notify(stopChan, os.Interrupt, syscall.SIGTERM)
	<-stopChan
	close(stopChan)
}
