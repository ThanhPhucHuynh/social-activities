package types

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Register struct {
	ID         primitive.ObjectID `json:"_id" bson:"_id,omitempty" validate:"required"`
	ActivityID primitive.ObjectID `json:"activityId" bson:"activityId,omitempty" validate:"required"`
	OfficerID  primitive.ObjectID `json:"officerId" bson:"officerId,omitempty" validate:"required"`
	IsAccept   bool               `json:"isAccept" bson:"isAccept"`
	AcceptBy   primitive.ObjectID `json:"acceptBy" bson:"acceptBy"`
	Rate       int64              `json:"rate" bson:"rate"`
	IsComplete bool               `json:"isComplete" bson:"isComplete"`
	CreateAt   time.Time          `json:"created_at" bson:"created_at"`
	UpdateAt   time.Time          `json:"updated_at" bson:"updated_at"`
}

type RegisterRespone struct {
	ID           primitive.ObjectID `json:"_id" bson:"_id,omitempty" validate:"required"`
	ActivityID   primitive.ObjectID `json:"activityId" bson:"activityId,omitempty" validate:"required"`
	OfficerID    primitive.ObjectID `json:"officerId" bson:"officerId,omitempty" validate:"required"`
	IsAccept     bool               `json:"isAccept" bson:"isAccept"`
	AcceptBy     primitive.ObjectID `json:"acceptBy" bson:"acceptBy"`
	Rate         int64              `json:"rate" bson:"rate"`
	IsComplete   bool               `json:"isComplete" bson:"isComplete"`
	CreateAt     time.Time          `json:"created_at" bson:"created_at"`
	UpdateAt     time.Time          `json:"updated_at" bson:"updated_at"`
	ActivityInfo ActivityI          `json:"activityInfo" bson:"activityInfo"`
	OfficerInfo  Officer            `json:"officerInfo" bson:"officerInfo"`
}
