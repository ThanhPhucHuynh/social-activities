package app

import (
	"fmt"
	"net/http"

	"social-activities/internal/app/db"
	"social-activities/internal/pkg/cities"
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

	mediaHandler "social-activities/internal/app/handlers/media"
	mediaRepository "social-activities/internal/app/repositories/media"
	mediaSrv "social-activities/internal/app/services/media"

	departmentHandler "social-activities/internal/app/handlers/department"
	departmentRepository "social-activities/internal/app/repositories/department"
	departmentSrv "social-activities/internal/app/services/department"

	activityHandler "social-activities/internal/app/handlers/activity"
	activityRepository "social-activities/internal/app/repositories/activity"
	activitySrv "social-activities/internal/app/services/activity"

	registerHandler "social-activities/internal/app/handlers/register"
	registerRepository "social-activities/internal/app/repositories/register"
	registerSrv "social-activities/internal/app/services/register"
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

	var userRepo userSrv.Repository
	var officerRepo officerSrv.Repository
	var mediaRepo mediaSrv.Repository
	var departmentRepo departmentSrv.Repository
	var activityRepo activitySrv.Repository
	var registerRepo registerSrv.Repository

	switch conns.Database.Type {
	case db.TypeMongoDB:
		s, err := config.Dial(&conns.Database.Mongo, logger)
		if err != nil {
			logger.Panicf("failed to dial to target server, err: %v", err)
		}
		userRepo = userRepository.NewMongoRepository(s)
		officerRepo = officerRepository.NewMongoRepository(s)
		mediaRepo = mediaRepository.NewMongoRepository(s)
		departmentRepo = departmentRepository.NewMongoRepository(s)
		activityRepo = activityRepository.NewMongoRepository(s)
		registerRepo = registerRepository.NewMongoRepository(s)
	default:
		panic("database type not supported: " + conns.Database.Type)
	}

	userLogger := logger.WithField("api", "user")
	userService := userSrv.NewService(conns, &em, userRepo, userLogger)
	userHandler := userHandler.New(conns, &em, userService, userLogger)

	officerLogger := logger.WithField("api", "officer")
	officerService := officerSrv.NewService(conns, &em, officerRepo, officerLogger)
	officerHandler := officerHandler.New(conns, &em, officerService, officerLogger)

	mediaLogger := logger.WithField("api", "media")
	mediaService := mediaSrv.NewService(conns, &em, mediaRepo, mediaLogger)
	mediaHandler := mediaHandler.New(conns, &em, mediaService, mediaLogger)

	departmentLogger := logger.WithField("api", "department")
	departmentServices := departmentSrv.NewService(conns, &em, departmentRepo, departmentLogger)
	departmenthandler := departmentHandler.New(conns, &em, departmentServices, departmentLogger)

	activityLogger := logger.WithField("api", "activity")
	activityServices := activitySrv.NewService(conns, &em, activityRepo, activityLogger)
	activityhandler := activityHandler.New(conns, &em, activityServices, activityLogger)

	registerLogger := logger.WithField("api", "register")
	registerServices := registerSrv.NewService(conns, &em, registerRepo, registerLogger)
	registerhandler := registerHandler.New(conns, &em, registerServices, registerLogger)

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
		}, {
			path:   "/officers",
			method: get,
			handlers: []func(c *fiber.Ctx) error{
				middleware.Auth,
				officerHandler.GetList,
			},
		},
		{
			path:   "/officer",
			method: put,
			handlers: []func(c *fiber.Ctx) error{
				middleware.Auth,
				officerHandler.Update,
			},
		},
		{
			path:   "/officers/password",
			method: put,
			handlers: []func(c *fiber.Ctx) error{
				middleware.Auth,
				officerHandler.ChangePW,
			},
		},
		{
			path:   "/root/password/:email",
			method: put,
			handlers: []func(c *fiber.Ctx) error{
				middleware.Auth,
				officerHandler.ResetPW,
			},
		},
		{
			path:   "/cities",
			method: get,
			handlers: []func(c *fiber.Ctx) error{
				cities.Cities,
			},
		},

		{
			path:   "/media",
			method: post,
			handlers: []func(c *fiber.Ctx) error{
				mediaHandler.Upload,
			},
		},
		{
			path:   "/media/:uuid",
			method: get,
			handlers: []func(c *fiber.Ctx) error{
				mediaHandler.Asset,
			},
		},
		{
			path:   "/media/:uuid",
			method: delete,
			handlers: []func(c *fiber.Ctx) error{
				mediaHandler.Destroy,
			},
		},

		{
			path:   "/department",
			method: post,
			handlers: []func(c *fiber.Ctx) error{
				middleware.Auth,
				departmenthandler.Add,
			},
		},
		{
			path:   "/department",
			method: get,
			handlers: []func(c *fiber.Ctx) error{
				middleware.Auth,
				departmenthandler.List,
			},
		},
		{
			path:   "/section",
			method: post,
			handlers: []func(c *fiber.Ctx) error{
				middleware.Auth,
				departmenthandler.AddSection,
			},
		},
		{
			path:   "/section/:id",
			method: get,
			handlers: []func(c *fiber.Ctx) error{
				middleware.Auth,
				departmenthandler.ListSection,
			},
		},
		//activity
		{
			path:   "/activity",
			method: post,
			handlers: []func(c *fiber.Ctx) error{
				middleware.Auth,
				activityhandler.Add,
			},
		},
		{
			path:   "/activity",
			method: put,
			handlers: []func(c *fiber.Ctx) error{
				middleware.Auth,
				activityhandler.Update,
			},
		},
		{
			path:   "/activity/acception",
			method: patch,
			handlers: []func(c *fiber.Ctx) error{
				middleware.Auth,
				activityhandler.Accept,
			},
		},
		{
			path:   "/activity/complete",
			method: patch,
			handlers: []func(c *fiber.Ctx) error{
				middleware.Auth,
				activityhandler.Complete,
			},
		},
		{
			path:   "/activity/destroy",
			method: patch,
			handlers: []func(c *fiber.Ctx) error{
				middleware.Auth,
				activityhandler.Destroy,
			},
		},
		{
			path:   "/activity/all",
			method: get,
			handlers: []func(c *fiber.Ctx) error{
				middleware.Auth,
				activityhandler.GetAll,
			},
		},
		{
			path:   "/activity/all/:officerId",
			method: get,
			handlers: []func(c *fiber.Ctx) error{
				middleware.Auth,
				activityhandler.GetAllListAllSrvIngone,
			},
		},
		{
			path:   "/activity/list/:officerId",
			method: get,
			handlers: []func(c *fiber.Ctx) error{
				middleware.Auth,
				activityhandler.GetListAllByIdOfficer,
			},
		},
		{
			path:   "/activity/list",
			method: get,
			handlers: []func(c *fiber.Ctx) error{
				middleware.Auth,
				activityhandler.GetListByIdOfficer,
			},
		},

		//register
		{
			path:   "/activity/register",
			method: post,
			handlers: []func(c *fiber.Ctx) error{
				middleware.Auth,
				registerhandler.Add,
			},
		},
		{
			path:   "/register/all",
			method: get,
			handlers: []func(c *fiber.Ctx) error{
				middleware.Auth,
				registerhandler.List,
			},
		},
		{
			path:   "/register/officer/:id",
			method: get,
			handlers: []func(c *fiber.Ctx) error{
				middleware.Auth,
				registerhandler.GetListByIdOfficer,
			},
		},
		{
			path:   "/register/officer/info/:id",
			method: get,
			handlers: []func(c *fiber.Ctx) error{
				middleware.Auth,
				registerhandler.GetListByIdOfficerInfo,
			},
		},
		{
			path:   "/register/activity/:id",
			method: get,
			handlers: []func(c *fiber.Ctx) error{
				middleware.Auth,
				registerhandler.GetListByIdActivity,
			},
		},
		{
			path:   "/register/activity/info/:id",
			method: get,
			handlers: []func(c *fiber.Ctx) error{
				middleware.Auth,
				registerhandler.GetListByIdActivityInfo,
			},
		},

		{
			path:   "/mail",
			method: post,
			handlers: []func(c *fiber.Ctx) error{
				userHandler.TestMail,
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
