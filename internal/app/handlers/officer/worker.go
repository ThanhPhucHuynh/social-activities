package officerHanders

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"social-activities/internal/app/types"
	"social-activities/internal/pkg/config"
	"social-activities/internal/pkg/glog"
	"social-activities/internal/pkg/respond"

	"github.com/gofiber/fiber/v2"
)

type (
	service interface {
		TestS(ctx context.Context) string
		RegisterSrv(ctx context.Context, userLogin types.Officer) (*types.UserResponseSignUp, error)
		LoginSrv(ctx context.Context, userLogin types.OfficerLogin) (*types.UserResponseSignUp, error)
		MeSrv(ctx context.Context, email string) (*types.Officer, error)
		List(ctx context.Context) ([]*types.Officer, error)
		ChangePW(ctx context.Context, email string, pw string) error
		ResetPW(ctx context.Context, email string) error
	}

	Handler struct {
		conf   *config.Config
		em     *config.ErrorMessage
		srv    service
		logger glog.Logger
	}
)

func New(c *config.Config, e *config.ErrorMessage, s service, l glog.Logger) *Handler {
	return &Handler{
		conf:   c,
		em:     e,
		srv:    s,
		logger: l,
	}
}

func (h *Handler) Test(c *fiber.Ctx) error {
	return respond.JSON(c, http.StatusOK, fmt.Sprintf("%s %s ", "hu ", h.srv.TestS(c.UserContext())))
}

func (h *Handler) RegisterHandler(c *fiber.Ctx) error {

	var UserLogin types.Officer

	if err := json.Unmarshal(c.Body(), &UserLogin); err != nil {
		h.logger.Errorc(c.UserContext(), "Can't unmarshal body %v", err)
		return respond.JSON(c, http.StatusBadRequest, h.em.InvalidValue.ValidationFailed)
	}

	officer, err := h.srv.RegisterSrv(c.UserContext(), UserLogin)
	if err != nil {
		return respond.JSON(c, http.StatusBadRequest, h.em.InvalidValue.CodeExists)
	}

	return respond.JSON(c, http.StatusOK, officer)
}

func (h *Handler) LoginHandler(c *fiber.Ctx) error {

	var UserLogin types.OfficerLogin

	if err := json.Unmarshal(c.Body(), &UserLogin); err != nil {
		h.logger.Errorc(c.UserContext(), "Can't unmarshal body %v", err)
		return respond.JSON(c, http.StatusBadRequest, h.em.InvalidValue.ValidationFailed)
	}
	user, err := h.srv.LoginSrv(c.UserContext(), UserLogin)
	if err != nil {
		return respond.JSON(c, http.StatusBadRequest, h.em.InvalidValue.IncorrectPasswordEmail)

	}

	return respond.JSON(c, http.StatusOK, user)
}

func (h *Handler) GetMe(c *fiber.Ctx) error {
	u := c.Locals("officer").(types.Claims)
	user, err := h.srv.MeSrv(c.UserContext(), u.Email)
	if err != nil {
		return respond.JSON(c, http.StatusBadRequest, h.em.InvalidValue.IncorrectPasswordEmail)

	}
	return respond.JSON(c, http.StatusOK, user)
}
func (h *Handler) GetList(c *fiber.Ctx) error {
	users, err := h.srv.List(c.UserContext())
	if err != nil {
		return respond.JSON(c, http.StatusBadRequest, h.em.InvalidValue.IncorrectPasswordEmail)

	}
	return respond.JSON(c, http.StatusOK, users)
}

func (h *Handler) ChangePW(c *fiber.Ctx) error {
	pw := struct {
		Password string `json:"password"`
	}{}
	if err := json.Unmarshal(c.Body(), &pw); err != nil {
		h.logger.Errorc(c.UserContext(), "Can't unmarshal body %v", err)
		return respond.JSON(c, http.StatusBadRequest, h.em.InvalidValue.ValidationFailed)
	}
	u := c.Locals("officer").(types.Claims)
	if err := h.srv.ChangePW(c.UserContext(), u.Email, pw.Password); err != nil {
		return respond.JSON(c, http.StatusBadRequest, h.em.InvalidValue.IncorrectPasswordEmail)
	}
	return respond.JSON(c, http.StatusOK, h.em.Success)
}

func (h *Handler) ResetPW(c *fiber.Ctx) error {
	if err := h.srv.ResetPW(c.UserContext(), c.Params("email")); err != nil {
		return respond.JSON(c, http.StatusBadRequest, h.em.InvalidValue.IncorrectPasswordEmail)
	}
	return respond.JSON(c, http.StatusOK, h.em.Success)
}
