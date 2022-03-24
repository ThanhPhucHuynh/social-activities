package auth

import (
	"strings"

	"social-activities/internal/pkg/jwt"

	"github.com/gofiber/fiber/v2"
)

// get token from Header
func ExtractToken(c *fiber.Ctx) string {

	tokenHeader := c.GetReqHeaders()["Authorization"]

	if tokenHeader == "" {
		return ""
	}
	splitted := strings.Split(tokenHeader, " ")

	if len(splitted) != 2 {
		return ""
	}

	tokenpath := splitted[1]

	return tokenpath
}

func IsAuthorized(tokenpath string) (map[string]interface{}, error) {
	claimMap, err := jwt.IsAuthorized(tokenpath)
	return claimMap, err
}
