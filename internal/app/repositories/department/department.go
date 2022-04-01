package departmentRepo

import (
	"context"

	"github.com/pkg/errors"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var (
	ErrNotFound = errors.New("not found")
)

type MongoRepository struct {
	client *mongo.Client
}

type User struct {
	ID   primitive.ObjectID `json:"_id" bson:"_id,omitempty" validate:"required"`
	Name string             `json:"name" bson:"name" validate:"required"`
}

func NewMongoRepository(c *mongo.Client) *MongoRepository {
	return &MongoRepository{
		client: c,
	}
}

// this method helps insert user
func (r *MongoRepository) Test(ctx context.Context) string {
	_, err := r.collection().InsertOne(ctx, User{
		ID:   primitive.NewObjectID(),
		Name: "test",
	})
	if err != nil {
		return "con heo, not create"
	}
	return "con cho"
}

func (r *MongoRepository) collection() *mongo.Collection {
	return r.client.Database("social").Collection("department")
}
