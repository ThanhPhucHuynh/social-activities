package departmentRepo

import (
	"context"
	"social-activities/internal/app/types"

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

func (r *MongoRepository) FindByName(ctx context.Context, name string) (*types.Department, error) {
	var dpm *types.Department
	err := r.collection().FindOne(ctx, bson.M{"name": name}).Decode(&dpm)
	return dpm, err
}

func (r *MongoRepository) FindByID(ctx context.Context, idDPM primitive.ObjectID) (*types.Department, error) {
	var dpm *types.Department

	err := r.collection().FindOne(ctx, bson.M{"_id": idDPM}).Decode(&dpm)

	return dpm, err
}

func (r *MongoRepository) Insert(ctx context.Context, dpm types.Department) error {
	_, err := r.collection().InsertOne(ctx, dpm)
	return err
}

func (r *MongoRepository) GetList(ctx context.Context) ([]*types.Department, error) {

	var result []*types.Department
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

func (r *MongoRepository) FindByNameSection(ctx context.Context, name string) (*types.Section, error) {
	var s *types.Section
	err := r.collectionSection().FindOne(ctx, bson.M{"name": name}).Decode(&s)
	return s, err
}

func (r *MongoRepository) FindBySectionNameId(ctx context.Context, name string, id primitive.ObjectID) (*types.Section, error) {
	var s *types.Section
	err := r.collectionSection().FindOne(ctx, bson.M{"name": name, "department_id": id}).Decode(&s)
	return s, err
}

func (r *MongoRepository) InsertSection(ctx context.Context, s types.Section) error {
	_, err := r.collectionSection().InsertOne(ctx, s)
	return err
}

func (r *MongoRepository) GetListSection(ctx context.Context, idDPM string) ([]*types.Section, error) {

	id, err := primitive.ObjectIDFromHex(idDPM)
	if err != nil {
		return nil, err
	}

	var result []*types.Section
	opts := options.Find()
	filter := bson.M{
		"department_id": id,
	}
	cursor, err := r.collectionSection().Find(ctx, filter, opts)
	if err != nil {
		return nil, err
	}

	if err = cursor.All(ctx, &result); err != nil {
		return nil, err
	}
	return result, err
}

func (r *MongoRepository) collection() *mongo.Collection {
	return r.client.Database("social").Collection("department")
}

func (r *MongoRepository) collectionSection() *mongo.Collection {
	return r.client.Database("social").Collection("section")
}
