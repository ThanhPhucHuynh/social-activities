package types

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Officer struct {
	ID       primitive.ObjectID `json:"_id" bson:"_id,omitempty" validate:"required"`
	Code     string             `json:"code" bson:"code,omitempty"`
	Name     string             `json:"name" bson:"name" validate:"required"`
	Email    string             `json:"email" bson:"email" validate:"email,required"`
	Birthday time.Time          `json:"birthday" bson:"birthday" validate:"required"`
	Password string             `json:"password,omitempty" bson:"password"`
	Avatar   string             `json:"avatar" bson:"avatar"` // arr path media
	Gender   string             `json:"gender" bson:"gender" validate:"required,max=60"`
	Country  string             `json:"country" bson:"country" validate:"required,max=60"`
	Phone    string             `json:"phone" bson:"phone" validate:"required,max=60"`
	Salary   float64            `json:"salary" bson:"salary"`
	Role     string             `json:"role" bson:"role"`
	CreateAt time.Time          `json:"created_at" bson:"created_at"`
	UpdateAt time.Time          `json:"updated_at" bson:"updated_at"`
}

type OfficerInToken struct {
	ID    primitive.ObjectID `json:"_id" bson:"_id,omitempty"`
	Name  string             `json:"name"`
	Code  string             `json:"code" bson:"code"`
	Email string             `json:"email"`
	Role  string             `json:"role" bson:"role"`
}

type UserResponseSignUp struct {
	ID     primitive.ObjectID `json:"_id" bson:"_id,omitempty"`
	Name   string             `json:"name"`
	Email  string             `json:"email"`
	Code   string             `json:"code"`
	Avatar string             `json:"avatar" bson:"avatar"` // arr path media
	Role   string             `json:"role" bson:"role"`
	Token  string             `json:"token"`
}

type OfficerLogin struct {
	Email    string `json:"email"`
	Password string `json:"password" bson:"password"`
}
