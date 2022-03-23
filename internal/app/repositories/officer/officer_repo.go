package officerRepo

import (
	"context"
	"social-activities/internal/app/types"

	"github.com/pkg/errors"
	"go.mongodb.org/mongo-driver/bson"
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

func (r *MongoRepository) FindByCode(ctx context.Context, code string) (*types.Officer, error) {
	var officer *types.Officer
	err := r.collection().FindOne(ctx, bson.M{"code": code}).Decode(&officer)
	return officer, err
}

func (r *MongoRepository) Insert(ctx context.Context, user types.Officer) error {
	_, err := r.collection().InsertOne(ctx, user)
	return err
}

func (r *MongoRepository) collection() *mongo.Collection {
	return r.client.Database("social").Collection("officer")
}
