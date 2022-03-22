package respond

import (
	"encoding/json"
	"net/http"

	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

func JSON(c *fiber.Ctx, status int, data interface{}) error {
	b, err := json.Marshal(data)
	if err != nil {
		return DefaultErrorHandler(c, errors.Wrap(err, "json marshal failed"), http.StatusInternalServerError)

	}
	c.Set("Content-Type", "application/json")
	c.Status(status)
	return c.Send(b)
}

// Error write error, status to http response writer
var DefaultErrorHandler = func(c *fiber.Ctx, err error, status int) error {
	// Set Content-Type: text/plain; charset=utf-8
	c.Set(fiber.HeaderContentType, fiber.MIMETextPlainCharsetUTF8)
	// Return statuscode with error message
	return c.Status(status).SendString(err.Error())
}
