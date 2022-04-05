package activityRepo

import (
	"context"
	"time"

	"social-activities/internal/app/types"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"

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

func (r *MongoRepository) FindByID(ctx context.Context, id primitive.ObjectID) (*types.ActivityI, error) {
	var dpm *types.ActivityI
	err := r.collection().FindOne(ctx, bson.M{"_id": id}).Decode(&dpm)
	return dpm, err
}

func (r *MongoRepository) GetAll(ctx context.Context) ([]*types.ActivityI, error) {
	var result []*types.ActivityI
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

func (r *MongoRepository) GetNotAccept(ctx context.Context) ([]*types.ActivityI, error) {
	var result []*types.ActivityI
	opts := options.Find()
	filter := bson.M{
		"isAccept": false,
	}
	cursor, err := r.collection().Find(ctx, filter, opts)
	if err != nil {
		return nil, err
	}

	if err = cursor.All(ctx, &result); err != nil {
		return nil, err
	}
	return result, err
}

func (r *MongoRepository) GetByOfficerID(ctx context.Context, id primitive.ObjectID) ([]*types.ActivityI, error) {
	var result []*types.ActivityI
	opts := options.Find()
	filter := bson.M{
		"created_by": id,
	}
	cursor, err := r.collection().Find(ctx, filter, opts)
	if err != nil {
		return nil, err
	}

	if err = cursor.All(ctx, &result); err != nil {
		return nil, err
	}
	return result, err
}

func (r *MongoRepository) Insert(ctx context.Context, a types.ActivityI) error {
	_, err := r.collection().InsertOne(ctx, a)
	return err
}

func (r *MongoRepository) Update(ctx context.Context, a types.ActivityI) error {
	newPW := bson.M{"$set": bson.M{
		"name":         a.Name,
		"description":  a.Description,
		"date":         a.Date,
		"tll":          a.TTL,
		"location":     a.Location,
		"section_name": a.SectionName,
		"updated_at":   time.Now(),
	}}
	_, err := r.collection().UpdateByID(ctx, a.ID, newPW)
	return err
}
func (r *MongoRepository) Appcept(ctx context.Context, id primitive.ObjectID) error {
	newPW := bson.M{"$set": bson.M{
		"isAccept":   true,
		"updated_at": time.Now(),
	}}
	_, err := r.collection().UpdateByID(ctx, id, newPW)
	return err
}

func (r *MongoRepository) collection() *mongo.Collection {
	return r.client.Database("social").Collection("activity")
}
