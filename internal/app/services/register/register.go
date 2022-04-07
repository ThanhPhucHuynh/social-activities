package registerServices

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
	Insert(ctx context.Context, rgt types.Register) error
	FindById(ctx context.Context, id primitive.ObjectID) (*types.Register, error)
	GetAllByActivityID(ctx context.Context, ActivityID primitive.ObjectID) ([]*types.Register, error)
	GetAllByIdOfficer(ctx context.Context, idOfficer primitive.ObjectID) ([]*types.Register, error)
	Appcept(ctx context.Context, rgt types.Register) error
	Rate(ctx context.Context, rgt types.Register) error
	IsComplete(ctx context.Context, rgt types.Register) error
	GetAll(ctx context.Context) ([]*types.Register, error)
	FindExits(ctx context.Context, rgt types.Register) (*types.Register, error)
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

func (s *Service) AddSrv(ctx context.Context, rgt types.Register) (*types.Register, error) {

	_, err := s.repo.FindExits(ctx, rgt)
	if err == nil {
		s.logger.Errorf("rgt have exit %v", err)
		return nil, errors.Wrap(errors.New("rgt have exit"), "rgt have exit %v")
	}

	temp := types.Register{
		ID:         primitive.NewObjectID(),
		ActivityID: rgt.ActivityID,
		OfficerID:  rgt.OfficerID,
		IsAccept:   false,
		IsComplete: false,
		CreateAt:   time.Now(),
	}

	if err := s.repo.Insert(ctx, temp); err != nil {
		s.logger.Errorf("Can't insert register %v", err)
		return nil, errors.Wrap(err, "Can't insert register")
	}
	s.logger.Infof("insert register %v")
	return &temp, nil
}

func (s *Service) GetAll(ctx context.Context) ([]*types.Register, error) {
	l, err := s.repo.GetAll(ctx)
	if err != nil {
		s.logger.Errorf("Can't get list Rgt %v", err)
		return nil, errors.Wrap(err, "Can't get list Rgt")
	}
	s.logger.Infof("Complete GetAll Rgt %v", err)
	return l, nil
}

func (s *Service) GetAllByActivityID(ctx context.Context, idAct string) ([]*types.Register, error) {
	id, err := primitive.ObjectIDFromHex(idAct)
	if err != nil {
		return nil, err
	}
	l, err := s.repo.GetAllByActivityID(ctx, id)
	if err != nil {
		s.logger.Errorf("Can't get list Rgt %v", err)
		return nil, errors.Wrap(err, "Can't get list Rgt")
	}
	s.logger.Infof("Complete GetAllByActivityID Rgt %v", err)
	return l, nil
}

func (s *Service) GetAllByIdOfficer(ctx context.Context, idAct string) ([]*types.Register, error) {
	id, err := primitive.ObjectIDFromHex(idAct)
	if err != nil {
		return nil, err
	}
	l, err := s.repo.GetAllByIdOfficer(ctx, id)
	if err != nil {
		s.logger.Errorf("Can't get list Rgt %v", err)
		return nil, errors.Wrap(err, "Can't get list Rgt")
	}
	s.logger.Infof("Complete GetAllByIdOfficer Rgt %v", err)
	return l, nil
}

func (s *Service) Appcept(ctx context.Context, c types.Claims, idAct string) error {
	id, err := primitive.ObjectIDFromHex(idAct)

	if err != nil {
		s.logger.Errorf("Can't FindById Rgt %v", err)
		return err
	}
	act, err := s.repo.FindById(ctx, id)
	if err != nil {
		s.logger.Errorf("Can't FindById Rgt %v", err)
		return errors.Wrap(err, "Can't FindById Rgt")
	}
	act.AcceptBy = c.ID
	if err := s.repo.Appcept(ctx, *act); err != nil {
		s.logger.Errorf("Can't get list Rgt %v", err)
		return errors.Wrap(err, "Can't get list Rgt")
	}
	s.logger.Infof("Complete Appcept Appcept Rgt %v", err)
	return nil
}

func (s *Service) IsComplete(ctx context.Context, idAct string) error {
	id, err := primitive.ObjectIDFromHex(idAct)

	if err != nil {
		s.logger.Errorf("Can't FindById Rgt %v", err)
		return err
	}
	act, err := s.repo.FindById(ctx, id)
	if err != nil {
		s.logger.Errorf("Can't FindById Rgt %v", err)
		return errors.Wrap(err, "Can't FindById Rgt")
	}
	if err := s.repo.IsComplete(ctx, *act); err != nil {
		s.logger.Errorf("Can't get IsComplete Rgt %v", err)
		return errors.Wrap(err, "Can't IsComplete list Rgt")
	}
	s.logger.Infof("Complete get IsComplete Rgt %v", err)
	return nil
}

func (s *Service) Rate(ctx context.Context, idAct string, rate int64) error {
	id, err := primitive.ObjectIDFromHex(idAct)

	if err != nil {
		s.logger.Errorf("Can't FindById Rgt %v", err)
		return err
	}
	act, err := s.repo.FindById(ctx, id)
	if err != nil {
		s.logger.Errorf("Can't FindById Rgt %v", err)
		return errors.Wrap(err, "Can't FindById Rgt")
	}
	act.Rate = rate
	if err := s.repo.Rate(ctx, *act); err != nil {
		s.logger.Errorf("Can't Rate Rate Rgt %v", err)
		return errors.Wrap(err, "Can't Rate Rate Rgt")
	}
	s.logger.Infof("Complete get Rate Rgt %v", err)
	return nil
}

func (s *Service) TestS(ctx context.Context) string {
	return fmt.Sprintf("%s %s ", "S ", s.repo.Test(ctx))
}
