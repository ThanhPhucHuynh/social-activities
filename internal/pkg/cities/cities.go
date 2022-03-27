package cities

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"social-activities/internal/pkg/respond"

	"github.com/gofiber/fiber/v2"
)

// "city": "Cần Thơ",
//         "province": "Cần Thơ",
//         "area": "1,408.9",
//         "population": "1,248,000"
type A struct {
	City       string `json:"city"`
	Province   string `json:"province"`
	Area       string `json:"area"`
	Population string `json:"population"`
}

func Cities(c *fiber.Ctx) error {
	jsonFile, err := os.Open("internal/pkg/cities/cities.json")
	// if we os.Open returns an error then handle it
	if err != nil {
		fmt.Println(err)
		return respond.JSON(c, http.StatusBadRequest, err)

	}
	byteValue, _ := ioutil.ReadAll(jsonFile)
	var As []A
	json.Unmarshal(byteValue, &As)
	// defer the closing of our jsonFile so that we can parse it later on
	defer jsonFile.Close()
	return respond.JSON(c, http.StatusOK, As)
	// return c.SendString("a")
}
