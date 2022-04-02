package departmentHanders

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
		AddSrv(ctx context.Context, Department types.Department) (*types.Department, error)
		ListSrv(ctx context.Context) ([]*types.Department, error)
		AddSection(ctx context.Context, S types.Section) (*types.Section, error)
		GetListSection(ctx context.Context, idDPM string) ([]*types.Section, error)
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

func (h *Handler) Add(c *fiber.Ctx) error {

	var Department types.Department

	if err := json.Unmarshal(c.Body(), &Department); err != nil {
		h.logger.Errorc(c.UserContext(), "Can't unmarshal body %v", err)
		return respond.JSON(c, http.StatusBadRequest, h.em.InvalidValue.ValidationFailed)
	}

	department, err := h.srv.AddSrv(c.UserContext(), Department)
	if err != nil {
		return respond.JSON(c, http.StatusBadRequest, h.em.InvalidValue.CodeExists)
	}

	return respond.JSON(c, http.StatusOK, department)
}

func (h *Handler) AddSection(c *fiber.Ctx) error {

	var s types.Section

	if err := json.Unmarshal(c.Body(), &s); err != nil {
		h.logger.Errorc(c.UserContext(), "Can't unmarshal body %v", err)
		return respond.JSON(c, http.StatusBadRequest, h.em.InvalidValue.ValidationFailed)
	}

	ss, err := h.srv.AddSection(c.UserContext(), s)
	if err != nil {
		return respond.JSON(c, http.StatusBadRequest, h.em.InvalidValue.CodeExists)
	}

	return respond.JSON(c, http.StatusOK, ss)
}
func (h *Handler) List(c *fiber.Ctx) error {

	department, err := h.srv.ListSrv(c.UserContext())
	if err != nil {
		return respond.JSON(c, http.StatusBadRequest, h.em.InvalidValue.CodeExists)
	}

	return respond.JSON(c, http.StatusOK, department)
}
func (h *Handler) ListSection(c *fiber.Ctx) error {

	s, err := h.srv.GetListSection(c.UserContext(), c.Params("id"))
	if err != nil {
		return respond.JSON(c, http.StatusBadRequest, h.em.InvalidValue.CodeExists)
	}

	return respond.JSON(c, http.StatusOK, s)
}

func (h *Handler) Test(c *fiber.Ctx) error {
	return respond.JSON(c, http.StatusOK, fmt.Sprintf("%s %s ", "hu ", h.srv.TestS(c.UserContext())))
}
