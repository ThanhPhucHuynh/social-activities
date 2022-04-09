package activityServices

import (
	"context"
	"fmt"
	"time"

	"social-activities/internal/app/types"
	"social-activities/internal/pkg/config"
	"social-activities/internal/pkg/glog"

	"github.com/pkg/errors"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Repository interface {
	Test(ctx context.Context) string
	FindByID(ctx context.Context, id primitive.ObjectID) (*types.ActivityI, error)
	GetAll(ctx context.Context) ([]*types.ActivityI, error)
	GetNotAccept(ctx context.Context) ([]*types.ActivityI, error)
	Insert(ctx context.Context, a types.ActivityI) error
	Update(ctx context.Context, a types.ActivityI) error
	GetByOfficerID(ctx context.Context, id primitive.ObjectID) ([]*types.ActivityI, error)
	Appcept(ctx context.Context, id primitive.ObjectID) error
}

// Service is an user service
type Service struct {
	conf   *config.Config
	em     *config.ErrorMessage
	repo   Repository
	logger glog.Logger
}

func NewService(c *config.Config, e *config.ErrorMessage, r Repository, l glog.Logger) *Service {
	return &Service{
		conf:   c,
		em:     e,
		repo:   r,
		logger: l,
	}
}

func (s *Service) TestS(ctx context.Context) string {
	return fmt.Sprintf("%s %s ", "S ", s.repo.Test(ctx))
}

func (s *Service) AddSrv(ctx context.Context, A types.ActivityI, c types.Claims) (*types.ActivityI, error) {

	act := types.ActivityI{
		ID:            primitive.NewObjectID(),
		Name:          A.Name,
		Description:   A.Description,
		Date:          A.Date,
		Picture:       A.Picture,
		TTL:           A.TTL,
		Location:      A.Location,
		TimeR:         A.TimeR,
		IsComplete:    false,
		SectionID:     A.SectionID,
		SectionName:   A.Description,
		CreateByEmail: A.CreateByEmail,
		CreateBy:      c.ID,
		CreateAt:      time.Now(),
	}

	act.IsAccept = true

	if c.Role == "officer" {
		act.IsAccept = false
	}

	if err := s.repo.Insert(ctx, act); err != nil {
		s.logger.Errorf("Can't insert act %v", err)
		return nil, errors.Wrap(err, "Can't insert act")
	}
	s.logger.Infof("insert act %v")
	return &act, nil
}
func (s *Service) ListAllSrv(ctx context.Context) ([]*types.ActivityI, error) {

	l, err := s.repo.GetAll(ctx)
	if err != nil {
		s.logger.Errorf("Can't get list act %v", err)
		return nil, errors.Wrap(err, "Can't get list act")
	}
	s.logger.Infof("get list act act %v")
	return l, nil
}
func (s *Service) GetNotAccept(ctx context.Context) ([]*types.ActivityI, error) {

	l, err := s.repo.GetNotAccept(ctx)
	if err != nil {
		s.logger.Errorf("Can't get list act %v", err)
		return nil, errors.Wrap(err, "Can't get list act")
	}
	return l, nil
}
func (s *Service) GetByOfficerID(ctx context.Context, c types.Claims) ([]*types.ActivityI, error) {

	l, err := s.repo.GetByOfficerID(ctx, c.ID)
	if err != nil {
		s.logger.Errorf("Can't get GetByOfficerID act %v", err)
		return nil, errors.Wrap(err, "Can't get GetByOfficerID act")
	}
	s.logger.Infof("GetByOfficerID act %v")
	return l, nil
}

func (s *Service) AppceptSrv(ctx context.Context, A types.ActivityI) error {

	if err := s.repo.Appcept(ctx, A.ID); err != nil {
		s.logger.Errorf("Can't get Appcept act %v", err)
		return errors.Wrap(err, "Can't get Appcept act")
	}
	s.logger.Infof("Appcept act %v")
	return nil
}

func (s *Service) Update(ctx context.Context, A types.ActivityI) error {

	act := types.ActivityI{
		ID:          A.ID,
		Name:        A.Name,
		Description: A.Description,
		Date:        A.Date,
		Picture:     A.Picture,
		TTL:         A.TTL,
		Location:    A.Location,
		TimeR:       A.TimeR,
		IsComplete:  false,
		SectionID:   A.SectionID,
		SectionName: A.Description,
		CreateAt:    time.Now(),
	}

	if err := s.repo.Update(ctx, act); err != nil {
		s.logger.Errorf("Can't insert act %v", err)
		return errors.Wrap(err, "Can't insert act")
	}
	s.logger.Infof("update act %v")
	return nil
}
