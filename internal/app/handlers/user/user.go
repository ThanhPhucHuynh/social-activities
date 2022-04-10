package userHanders

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"social-activities/internal/pkg/config"
	"social-activities/internal/pkg/glog"
	"social-activities/internal/pkg/respond"

	mailpkg "social-activities/internal/pkg/mail"

	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

var (
	// GenCode  = mailpkg.GenCode
	Sendmail = mailpkg.Sendmail
)

type (
	service interface {
		TestS(ctx context.Context) string
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

type MailBody struct {
	Emails  []string `json: "emails"`
	Content string   `json: "content"`
	Subject string   `json: "subject"`
}

func (h *Handler) TestMail(c *fiber.Ctx) error {
	var mailBody MailBody

	if err := json.Unmarshal(c.Body(), &mailBody); err != nil {
		h.logger.Errorc(c.UserContext(), "Can't unmarshal body %v", err)
		return respond.JSON(c, http.StatusBadRequest, h.em.InvalidValue.ValidationFailed)
	}

	if err := Sendmail(mailpkg.Mail{
		Subject: mailBody.Subject,
		Body:    mailBody.Content,
	}, mailBody.Emails, h.conf); err != nil {
		h.logger.Errorf("failed %v", err)
		return respond.JSON(c, http.StatusForbidden, errors.Wrap(err, "Send mail fail"))

	}
	return respond.JSON(c, http.StatusOK, h.em.Success)
}
