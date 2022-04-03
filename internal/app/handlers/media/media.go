package mediahandler

import (
	"context"
	"io/ioutil"
	"net/http"

	"social-activities/internal/app/types"
	"social-activities/internal/pkg/config"
	"social-activities/internal/pkg/glog"
	"social-activities/internal/pkg/respond"

	"github.com/gofiber/fiber/v2"
)

type (
	service interface {
		Upload(ctx context.Context, fileBytes []byte) (*types.MediaResponse, error)
		Destroy(ctx context.Context, url string) error
		Asset(ctx context.Context, url string) (*types.MediaResponse, error)
	}
	// Handler is media web handler
	Handler struct {
		conf   *config.Config
		em     *config.ErrorMessage
		srv    service
		logger glog.Logger
	}
)

// New returns new res api media handler
func New(c *config.Config, e *config.ErrorMessage, s service, l glog.Logger) *Handler {
	return &Handler{
		conf:   c,
		em:     e,
		srv:    s,
		logger: l,
	}
}

// Put handler update media
func (h *Handler) Upload(c *fiber.Ctx) error {

	file, err := c.FormFile("files")

	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": true,
			"msg":   err.Error(),
		})
	}

	buffer, err := file.Open()
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": true,
			"msg":   err.Error(),
		})
	}
	defer buffer.Close()
	fileBytes, err := ioutil.ReadAll(buffer)
	if err != nil {
		h.logger.Errorc(c.UserContext(), "ReadAll file: %v", err)
		return respond.JSON(c, http.StatusBadRequest, h.em.InvalidValue.Request)

	}

	media, err := h.srv.Upload(c.UserContext(), fileBytes)
	if err != nil {
		return respond.JSON(c, http.StatusBadRequest, h.em.InvalidValue.Request)

	}

	return respond.JSON(c, http.StatusCreated, media)
}

// Del handler delete media
func (h *Handler) Destroy(c *fiber.Ctx) error {
	err := h.srv.Destroy(c.UserContext(), c.Params("uuid"))
	if err != nil {
		return respond.JSON(c, http.StatusBadRequest, h.em.InvalidValue.Request)

	}
	return respond.JSON(c, http.StatusOK, h.em.Success)

}

// Get handler get media
func (h *Handler) Asset(c *fiber.Ctx) error {
	media, err := h.srv.Asset(c.UserContext(), c.Params("uuid"))
	if err != nil {
		return respond.JSON(c, http.StatusBadRequest, h.em.InvalidValue.Request)

	}

	return respond.JSON(c, http.StatusOK, media)
}
