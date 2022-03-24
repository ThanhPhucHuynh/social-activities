package app

import (
	"fmt"
	"net/http"

	"social-activities/internal/app/db"
	"social-activities/internal/pkg/config"
	"social-activities/internal/pkg/glog"
	"social-activities/internal/pkg/middleware"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"

	userHandler "social-activities/internal/app/handlers/user"
	userRepository "social-activities/internal/app/repositories/user"
	userSrv "social-activities/internal/app/services/user"

	officerHandler "social-activities/internal/app/handlers/officer"
	officerRepository "social-activities/internal/app/repositories/officer"
	officerSrv "social-activities/internal/app/services/officer"
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
		path     string
		method   string
		handlers []func(c *fiber.Ctx) error
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
	var officerRepo officerSrv.Repository

	switch conns.Database.Type {
	case db.TypeMongoDB:
		s, err := config.Dial(&conns.Database.Mongo, logger)
		if err != nil {
			logger.Panicf("failed to dial to target server, err: %v", err)
		}
		userRepo = userRepository.NewMongoRepository(s)
		officerRepo = officerRepository.NewMongoRepository(s)
	default:
		panic("database type not supported: " + conns.Database.Type)
	}

	userLogger := logger.WithField("package", "user")
	userService := userSrv.NewService(conns, &em, userRepo, userLogger)
	userHandler := userHandler.New(conns, &em, userService, userLogger)

	officerLogger := logger.WithField("package", "user")
	officerService := officerSrv.NewService(conns, &em, officerRepo, officerLogger)
	officerHandler := officerHandler.New(conns, &em, officerService, officerLogger)

	middleware := middleware.New(conns, &em)

	routes := []route{
		{
			path:   "/test",
			method: get,
			handlers: []func(c *fiber.Ctx) error{
				userHandler.Test,
			},
		},
		{
			path:   "/register",
			method: post,
			handlers: []func(c *fiber.Ctx) error{
				officerHandler.RegisterHandler,
			},
		},
		{
			path:   "/login",
			method: post,
			handlers: []func(c *fiber.Ctx) error{
				officerHandler.LoginHandler,
			},
		},
		{
			path:   "/me",
			method: get,
			handlers: []func(c *fiber.Ctx) error{
				middleware.Auth,
				officerHandler.GetMe,
			},
		},
	}

	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowMethods: "GET,POST,HEAD,PUT,DELETE,PATCH",
		AllowHeaders: "",
	}))
	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Hello, World!")
	})

	for _, rt := range routes {
		app.Add(rt.method, rt.path, rt.handlers...)
	}

	return &App{
		server: *app,
		conf:   *conns,
		log:    *logger,
	}, nil
}

func (app *App) Start() {

	app.log.Fatal(app.server.Listen(fmt.Sprintf("0.0.0.0:%d", app.conf.HTTPServer.Port)))
}

func (app *App) Stop() {
	app.log.Infof("Server is stopping....")
}
