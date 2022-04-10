package registerRepo

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

func (r *MongoRepository) Insert(ctx context.Context, rgt types.Register) error {
	_, err := r.collection().InsertOne(ctx, rgt)
	return err
}

func (r *MongoRepository) FindById(ctx context.Context, id primitive.ObjectID) (*types.Register, error) {
	var rgt *types.Register
	err := r.collection().FindOne(ctx, bson.M{"_id": id}).Decode(&rgt)
	return rgt, err
}

func (r *MongoRepository) FindExits(ctx context.Context, rgt types.Register) (*types.Register, error) {
	var rgtF *types.Register
	err := r.collection().FindOne(ctx, bson.M{
		"activityId": rgt.ActivityID,
		"officerId":  rgt.OfficerID,
	}).Decode(&rgtF)
	return rgtF, err
}

func (r *MongoRepository) GetAllByIdOfficer(ctx context.Context, idOfficer primitive.ObjectID) ([]*types.Register, error) {
	var result []*types.Register
	opts := options.Find()
	filter := bson.M{
		"officerId": idOfficer,
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

func (r *MongoRepository) GetAllByIdOfficerInfo(ctx context.Context, idOfficer primitive.ObjectID) ([]*types.RegisterRespone, error) {
	var result []*types.RegisterRespone

	query := []bson.M{
		{
			"$match": bson.M{
				"officerId": idOfficer,
			},
		},
		{
			"$lookup": bson.M{
				"from": "officer",
				"let":  bson.M{"officerId": "$officerId"},
				"pipeline": []bson.M{
					{
						"$match": bson.M{
							"$expr": bson.M{
								"$eq": []string{"$_id", "$$officerId"},
							},
						},
					},
				},
				"as": "officerInfo",
			},
		},
		{
			"$lookup": bson.M{
				"from": "activity",
				"let":  bson.M{"activityId": "$activityId"},
				"pipeline": []bson.M{
					{
						"$match": bson.M{
							"$expr": bson.M{
								"$eq": []string{"$_id", "$$activityId"},
							},
						},
					},
				},
				"as": "activityInfo",
			},
		},
		{"$addFields": bson.M{
			"activityInfo": bson.M{"$last": "$activityInfo"},
			"officerInfo":  bson.M{"$last": "$officerInfo"},
		}},
	}

	cursor, err := r.collection().Aggregate(ctx, query)
	if err != nil {
		return nil, err
	}

	if err = cursor.All(ctx, &result); err != nil {
		return nil, err
	}
	return result, err
}

func (r *MongoRepository) GetAll(ctx context.Context) ([]*types.Register, error) {
	var result []*types.Register
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

func (r *MongoRepository) GetAllByActivityID(ctx context.Context, ActivityID primitive.ObjectID) ([]*types.Register, error) {
	var result []*types.Register
	opts := options.Find()
	filter := bson.M{
		"activityId": ActivityID,
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

func (r *MongoRepository) GetAllByActivityIDInfo(ctx context.Context, ActivityID primitive.ObjectID) ([]*types.RegisterRespone, error) {
	var result []*types.RegisterRespone

	query := []bson.M{
		{
			"$match": bson.M{
				"officerId": ActivityID,
			},
		},
		{
			"$lookup": bson.M{
				"from": "officer",
				"let":  bson.M{"officerId": "$officerId"},
				"pipeline": []bson.M{
					{
						"$match": bson.M{
							"$expr": bson.M{
								"$eq": []string{"$_id", "$$officerId"},
							},
						},
					},
				},
				"as": "officerInfo",
			},
		},
		{
			"$lookup": bson.M{
				"from": "activity",
				"let":  bson.M{"activityId": "$activityId"},
				"pipeline": []bson.M{
					{
						"$match": bson.M{
							"$expr": bson.M{
								"$eq": []string{"$_id", "$$activityId"},
							},
						},
					},
				},
				"as": "activityInfo",
			},
		},
		{"$addFields": bson.M{
			"activityInfo": bson.M{"$last": "$activityInfo"},
			"officerInfo":  bson.M{"$last": "$officerInfo"},
		}},
	}

	cursor, err := r.collection().Aggregate(ctx, query)
	if err != nil {
		return nil, err
	}

	if err = cursor.All(ctx, &result); err != nil {
		return nil, err
	}
	return result, err
}

func (r *MongoRepository) Appcept(ctx context.Context, rgt types.Register) error {
	newPW := bson.M{"$set": bson.M{
		"isAccept": true,
		"acceptBy": rgt.AcceptBy,
	}}
	_, err := r.collection().UpdateByID(ctx, rgt.ID, newPW)
	return err
}

func (r *MongoRepository) Rate(ctx context.Context, rgt types.Register) error {
	newPW := bson.M{"$set": bson.M{
		"rate": rgt.Rate,
	}}
	_, err := r.collection().UpdateByID(ctx, rgt.ID, newPW)
	return err
}

func (r *MongoRepository) IsComplete(ctx context.Context, rgt types.Register) error {
	newPW := bson.M{"$set": bson.M{
		"isComplete": true,
	}}
	_, err := r.collection().UpdateByID(ctx, rgt.ID, newPW)
	return err
}

func (r *MongoRepository) collection() *mongo.Collection {
	return r.client.Database("social").Collection("register")
}
