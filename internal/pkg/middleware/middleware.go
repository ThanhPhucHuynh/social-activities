package middleware

import (
	"encoding/json"
	"net/http"

	"social-activities/internal/app/types"
	"social-activities/internal/pkg/auth"
	"social-activities/internal/pkg/config"
	"social-activities/internal/pkg/glog"
	"social-activities/internal/pkg/respond"

	"github.com/gofiber/fiber/v2"
)

type (
	service interface {
	}

	Middleware struct {
		conf   *config.Config
		em     *config.ErrorMessage
		logger glog.Logger
	}
)

func New(c *config.Config, e *config.ErrorMessage) *Middleware {
	return &Middleware{
		conf:   c,
		em:     e,
		logger: glog.New().WithField("package", "middleware"),
	}
}

func (m *Middleware) Auth(c *fiber.Ctx) error {
	tokenpath := auth.ExtractToken(c)
	if tokenpath == "" {
		m.logger.Errorf("The request does not contain token")
		return respond.JSON(c, http.StatusUnauthorized, m.em.InvalidValue.FailedAuthentication)
	}

	u, err := auth.IsAuthorized(tokenpath)
	if err != nil {
		m.logger.Errorf("Not authorized, error: ", err)
		return respond.JSON(c, http.StatusUnauthorized, m.em.InvalidValue.FailedAuthentication)
	}
	dbByte, _ := json.Marshal(u)

	var b types.Claims
	if err := json.Unmarshal(dbByte, &b); err != nil {
		m.logger.Errorf("Not unmarshal, error: ", err)
		return respond.JSON(c, http.StatusUnauthorized, m.em.InvalidValue.FailedAuthentication)
	}

	c.Locals("officer", b)

	return c.Next()
}
