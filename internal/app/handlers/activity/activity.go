package activityHanders

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
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type (
	service interface {
		TestS(ctx context.Context) string
		AddSrv(ctx context.Context, A types.ActivityI, c types.Claims) (*types.ActivityI, error)
		ListAllSrv(ctx context.Context) ([]*types.ActivityI, error)
		GetNotAccept(ctx context.Context) ([]*types.ActivityI, error)
		GetByOfficerID(ctx context.Context, c types.Claims) ([]*types.ActivityI, error)
		AppceptSrv(ctx context.Context, A types.ActivityI) error
		Update(ctx context.Context, A types.ActivityI) error
		CompleteSrv(ctx context.Context, A types.ActivityI) error
		DestroySrv(ctx context.Context, A types.ActivityI) error
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
	var a types.ActivityI

	u := c.Locals("officer").(types.Claims)

	if err := json.Unmarshal(c.Body(), &a); err != nil {
		h.logger.Errorc(c.UserContext(), "Can't unmarshal body %v", err)
		return respond.JSON(c, http.StatusBadRequest, h.em.InvalidValue.ValidationFailed)
	}

	aa, err := h.srv.AddSrv(c.UserContext(), a, u)

	if err != nil {
		return respond.JSON(c, http.StatusBadRequest, h.em.InvalidValue.CodeExists)
	}

	return respond.JSON(c, http.StatusOK, aa)
}

func (h *Handler) Update(c *fiber.Ctx) error {
	var a types.ActivityI

	if err := json.Unmarshal(c.Body(), &a); err != nil {
		h.logger.Errorc(c.UserContext(), "Can't unmarshal body %v", err)
		return respond.JSON(c, http.StatusBadRequest, h.em.InvalidValue.ValidationFailed)
	}

	if err := h.srv.Update(c.UserContext(), a); err != nil {
		return respond.JSON(c, http.StatusBadRequest, h.em.InvalidValue.CodeExists)
	}

	return respond.JSON(c, http.StatusOK, h.em.Success)
}

func (h *Handler) Accept(c *fiber.Ctx) error {
	var a types.ActivityI

	if err := json.Unmarshal(c.Body(), &a); err != nil {
		h.logger.Errorc(c.UserContext(), "Can't unmarshal body %v", err)
		return respond.JSON(c, http.StatusBadRequest, h.em.InvalidValue.ValidationFailed)
	}

	if err := h.srv.AppceptSrv(c.UserContext(), a); err != nil {
		return respond.JSON(c, http.StatusBadRequest, h.em.InvalidValue.CodeExists)
	}

	return respond.JSON(c, http.StatusOK, h.em.Success)
}
func (h *Handler) Complete(c *fiber.Ctx) error {
	var a types.ActivityI

	if err := json.Unmarshal(c.Body(), &a); err != nil {
		h.logger.Errorc(c.UserContext(), "Can't unmarshal body %v", err)
		return respond.JSON(c, http.StatusBadRequest, h.em.InvalidValue.ValidationFailed)
	}

	if err := h.srv.CompleteSrv(c.UserContext(), a); err != nil {
		return respond.JSON(c, http.StatusBadRequest, h.em.InvalidValue.CodeExists)
	}

	return respond.JSON(c, http.StatusOK, h.em.Success)
}
func (h *Handler) Destroy(c *fiber.Ctx) error {
	var a types.ActivityI

	if err := json.Unmarshal(c.Body(), &a); err != nil {
		h.logger.Errorc(c.UserContext(), "Can't unmarshal body %v", err)
		return respond.JSON(c, http.StatusBadRequest, h.em.InvalidValue.ValidationFailed)
	}

	if err := h.srv.DestroySrv(c.UserContext(), a); err != nil {
		return respond.JSON(c, http.StatusBadRequest, h.em.InvalidValue.CodeExists)
	}

	return respond.JSON(c, http.StatusOK, h.em.Success)
}
func (h *Handler) GetAll(c *fiber.Ctx) error {
	l, err := h.srv.ListAllSrv(c.UserContext())
	if err != nil {
		return respond.JSON(c, http.StatusBadRequest, h.em.InvalidValue.ValidationFailed)
	}
	return respond.JSON(c, http.StatusOK, l)
}

func (h *Handler) GetListByIdOfficer(c *fiber.Ctx) error {
	u := c.Locals("officer").(types.Claims)
	l, err := h.srv.GetByOfficerID(c.UserContext(), u)
	if err != nil {
		return respond.JSON(c, http.StatusBadRequest, h.em.InvalidValue.CodeExists)
	}
	return respond.JSON(c, http.StatusOK, l)
}

func (h *Handler) GetListAllByIdOfficer(c *fiber.Ctx) error {
	u := c.Locals("officer").(types.Claims)
	id, err := primitive.ObjectIDFromHex(c.Params("officerId"))
	if err != nil {
		return respond.JSON(c, http.StatusBadRequest, h.em.InvalidValue.CodeExists)
	}
	u.ID = id
	l, err := h.srv.GetByOfficerID(c.UserContext(), u)
	if err != nil {
		return respond.JSON(c, http.StatusBadRequest, h.em.InvalidValue.CodeExists)
	}
	return respond.JSON(c, http.StatusOK, l)
}
