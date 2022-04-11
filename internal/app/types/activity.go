package types

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Department struct {
	ID       primitive.ObjectID `json:"_id" bson:"_id,omitempty" validate:"required"`
	Name     string             `json:"name" bson:"name" validate:"required"`
	CreateAt time.Time          `json:"created_at" bson:"created_at"`
	UpdateAt time.Time          `json:"updated_at" bson:"updated_at"`
}

type Section struct {
	ID             primitive.ObjectID `json:"_id" bson:"_id,omitempty" validate:"required"`
	Name           string             `json:"name" bson:"name" validate:"required"`
	DepartmentID   primitive.ObjectID `json:"department_id" bson:"department_id"`
	DepartmentName string             `json:"department_name" bson:"department_name"`
	CreateAt       time.Time          `json:"created_at" bson:"created_at"`
	UpdateAt       time.Time          `json:"updated_at" bson:"updated_at"`
}

type ActivityI struct {
	ID            primitive.ObjectID `json:"_id" bson:"_id,omitempty" validate:"required"`
	Name          string             `json:"name" bson:"name" validate:"required"`
	Description   string             `json:"description" bson:"description"`
	Date          []time.Time        `json:"date" bson:"date" validate:"required"`
	Picture       []string           `json:"picture" bson:"picture"` // arr path media
	TTL           time.Duration      `json:"tll" bson:"tll"`
	Location      string             `json:"location" bson:"location"`
	TimeR         int                `json:"time_range" bson:"time_range"`
	IsComplete    bool               `json:"is_complete" bson:"is_complete"`
	SectionID     primitive.ObjectID `json:"section_id" bson:"section_id"`
	SectionName   string             `json:"section_name" bson:"section_name"`
	IsAccept      bool               `json:"isAccept" bson:"isAccept"`
	CreateBy      primitive.ObjectID `json:"created_by" bson:"created_by"`
	CreateByEmail string             `json:"created_by_email" bson:"created_by_email"`
	Destroy       bool               `json:"destroy" bson:"destroy"`
	CreateAt      time.Time          `json:"created_at" bson:"created_at"`
	UpdateAt      time.Time          `json:"updated_at" bson:"updated_at"`
}

type ActivityIResponeOfficer struct {
	ID            primitive.ObjectID `json:"_id" bson:"_id,omitempty" validate:"required"`
	Name          string             `json:"name" bson:"name" validate:"required"`
	Description   string             `json:"description" bson:"description"`
	Date          []time.Time        `json:"date" bson:"date" validate:"required"`
	Picture       []string           `json:"picture" bson:"picture"` // arr path media
	TTL           time.Duration      `json:"tll" bson:"tll"`
	Location      string             `json:"location" bson:"location"`
	TimeR         int                `json:"time_range" bson:"time_range"`
	IsComplete    bool               `json:"is_complete" bson:"is_complete"`
	SectionID     primitive.ObjectID `json:"section_id" bson:"section_id"`
	SectionName   string             `json:"section_name" bson:"section_name"`
	IsAccept      bool               `json:"isAccept" bson:"isAccept"`
	IsRegister    bool               `json:"isRegister" bson:"isRegister"`
	CreateBy      primitive.ObjectID `json:"created_by" bson:"created_by"`
	CreateByEmail string             `json:"created_by_email" bson:"created_by_email"`
	Destroy       bool               `json:"destroy" bson:"destroy"`
	CreateAt      time.Time          `json:"created_at" bson:"created_at"`
	UpdateAt      time.Time          `json:"updated_at" bson:"updated_at"`
}
