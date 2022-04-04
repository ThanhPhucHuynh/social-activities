package officerRepo

import (
	"context"
	"social-activities/internal/app/types"
	"time"

	"github.com/pkg/errors"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
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
func (r *MongoRepository) GetAll(ctx context.Context) ([]*types.Officer, error) {
	var result []*types.Officer
	opts := options.Find()
	filter := bson.M{}
	cursor, err := r.collection().Find(ctx, filter, opts)
	if err != nil {
		return nil, err
	}

	if err = cursor.All(ctx, &result); err != nil {
		return nil, err
	}
	return result, err
}
func (r *MongoRepository) FindByEmail(ctx context.Context, email string) (*types.Officer, error) {
	var officer *types.Officer
	err := r.collection().FindOne(ctx, bson.M{"email": email}).Decode(&officer)
	return officer, err
}

func (r *MongoRepository) Insert(ctx context.Context, user types.Officer) error {
	_, err := r.collection().InsertOne(ctx, user)
	return err
}

func (r *MongoRepository) ResetPW(ctx context.Context, user types.Officer) error {
	newPW := bson.M{"$set": bson.M{
		"password":   user.Password,
		"updated_at": time.Now(),
	}}
	_, err := r.collection().UpdateByID(ctx, user.ID, newPW)
	return err
}

func (r *MongoRepository) Update(ctx context.Context, user types.Officer) error {
	newPW := bson.M{"$set": bson.M{
		"name":       user.Password,
		"birthday":   user.Birthday,
		"avatar":     user.Avatar,
		"gender":     user.Gender,
		"country":    user.Country,
		"phone":      user.Phone,
		"updated_at": time.Now(),
	}}
	_, err := r.collection().UpdateByID(ctx, user.ID, newPW)
	return err
}

func (r *MongoRepository) collection() *mongo.Collection {
	return r.client.Database("social").Collection("officer")
}
