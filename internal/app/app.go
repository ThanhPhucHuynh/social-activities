package app

import (
	"fmt"
	"net/http"

	"social-activities/internal/app/db"
	"social-activities/internal/pkg/config"
	"social-activities/internal/pkg/glog"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"

	userHandler "social-activities/internal/app/handlers/user"
	userRepository "social-activities/internal/app/repositories/user"
	userSrv "social-activities/internal/app/services/user"
)

const (
	get    = http.MethodGet
	post   = http.MethodPost
	put    = http.MethodPut
	delete = http.MethodDelete
	patch  = http.MethodPatch
)

type (
	App struct {
		server fiber.App
		conf   config.Config
		log    glog.Social_activities
	}

	route struct {
		path    string
		method  string
		handler func(c *fiber.Ctx) error
	}
)

func Init(conns *config.Config, em config.ErrorMessage) (*App, error) {
	logger := glog.New()

	// server := fiber.New(fiber.Config{
	// 	// ErrorHandler: func(c *fiber.Ctx, err error) error {
	// 	// 	return c.Status(200).SendString("Error handler")
	// 	// },
	// })

	var userRepo userSrv.Repository

	switch conns.Database.Type {
	case db.TypeMongoDB:
		s, err := config.Dial(&conns.Database.Mongo, logger)
		if err != nil {
			logger.Panicf("failed to dial to target server, err: %v", err)
		}
		userRepo = userRepository.NewMongoRepository(s)

	default:
		panic("database type not supported: " + conns.Database.Type)
	}

	userLogger := logger.WithField("package", "user")
	userService := userSrv.NewService(conns, &em, userRepo, userLogger)
	userHandler := userHandler.New(conns, &em, userService, userLogger)

	routes := []route{
		{
			path:    "/test",
			method:  get,
			handler: userHandler.Test,
		},
	}

	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowOrigins:     "*",
		AllowMethods:     "GET,POST,HEAD,PUT,DELETE,PATCH",
		AllowHeaders:     "",
	}))
	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Hello, World!")
	})

	for _, rt := range routes {
		h := rt.handler
		// hh := fiber.Handler
		// for _, mdw := range rt.middlewares {
		// 	h = mdw(h, &em)
		// }
		app.Add(rt.method, rt.path, h)
	}

	return &App{
		server: *app,
		conf:   *conns,
		log:    *logger,
	}, nil
}

func (app *App) Start() {
	app.log.Fatal(app.server.Listen(fmt.Sprintf(":%d", app.conf.HTTPServer.Port)))
}

func (app *App) Stop() {
	app.log.Infof("Server is stopping....")
}
