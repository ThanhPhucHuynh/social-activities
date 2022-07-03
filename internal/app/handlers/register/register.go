package registerHanders

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"social-activities/internal/app/types"
	"social-activities/internal/pkg/config"
	"social-activities/internal/pkg/glog"
	"social-activities/internal/pkg/respond"

	"github.com/gofiber/fiber/v2"
)

type (
	service interface {
		TestS(ctx context.Context) string
		AddSrv(ctx context.Context, rgt types.Register) (*types.Register, error)
		GetAll(ctx context.Context) ([]*types.Register, error)
		GetAllByActivityID(ctx context.Context, idAct string) ([]*types.Register, error)
		GetAllByIdOfficer(ctx context.Context, idAct string) ([]*types.Register, error)
		Appcept(ctx context.Context, c types.Claims, idAct string) error
		IsComplete(ctx context.Context, idAct string) error
		Rate(ctx context.Context, idAct string, rate int64) error
		GetAllByIdOfficerInfo(ctx context.Context, idAct string) ([]*types.RegisterRespone, error)
		GetAllByActivityIDInfo(ctx context.Context, idAct string) ([]*types.RegisterRespone, error)
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

func (h *Handler) Add(c *fiber.Ctx) error {

	var register types.Register

	if err := json.Unmarshal(c.Body(), &register); err != nil {
		h.logger.Errorc(c.UserContext(), "Can't unmarshal body %v", err)
		return respond.JSON(c, http.StatusBadRequest, h.em.InvalidValue.ValidationFailed)
	}
	department, err := h.srv.AddSrv(c.UserContext(), register)
	if err != nil {
		return respond.JSON(c, http.StatusBadRequest, h.em.InvalidValue.CodeExists)
	}
	return respond.JSON(c, http.StatusOK, department)
}

func (h *Handler) List(c *fiber.Ctx) error {

	registers, err := h.srv.GetAll(c.UserContext())
	if err != nil {
		return respond.JSON(c, http.StatusBadRequest, h.em.InvalidValue.CodeExists)
	}

	return respond.JSON(c, http.StatusOK, registers)
}

func (h *Handler) GetListByIdOfficer(c *fiber.Ctx) error {

	registers, err := h.srv.GetAllByIdOfficer(c.UserContext(), c.Params("id"))
	if err != nil {
		return respond.JSON(c, http.StatusBadRequest, h.em.InvalidValue.CodeExists)
	}

	return respond.JSON(c, http.StatusOK, registers)
}

func (h *Handler) GetListByIdOfficerInfo(c *fiber.Ctx) error {

	registers, err := h.srv.GetAllByIdOfficerInfo(c.UserContext(), c.Params("id"))
	if err != nil {
		return respond.JSON(c, http.StatusBadRequest, h.em.InvalidValue.CodeExists)
	}

	return respond.JSON(c, http.StatusOK, registers)
}
func (h *Handler) GetListByIdActivity(c *fiber.Ctx) error {

	registers, err := h.srv.GetAllByActivityID(c.UserContext(), c.Params("id"))
	if err != nil {
		return respond.JSON(c, http.StatusBadRequest, h.em.InvalidValue.CodeExists)
	}

	return respond.JSON(c, http.StatusOK, registers)
}
func (h *Handler) GetListByIdActivityInfo(c *fiber.Ctx) error {

	registers, err := h.srv.GetAllByActivityIDInfo(c.UserContext(), c.Params("id"))
	if err != nil {
		return respond.JSON(c, http.StatusBadRequest, h.em.InvalidValue.CodeExists)
	}

	return respond.JSON(c, http.StatusOK, registers)
}
func (h *Handler) Rate(c *fiber.Ctx) error {

	r, _ := strconv.ParseInt(c.Params("rate"), 10, 64)

	err := h.srv.Rate(c.UserContext(), c.Params("id"), r)
	
	if err != nil {
		return respond.JSON(c, http.StatusBadRequest, h.em.InvalidValue.CodeExists)
	}

	return respond.JSON(c, http.StatusOK, h.em.Success)
}
