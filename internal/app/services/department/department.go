package departmentServices

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
	Insert(ctx context.Context, dpm types.Department) error
	FindByName(ctx context.Context, name string) (*types.Department, error)
	GetList(ctx context.Context) ([]*types.Department, error)
	FindByID(ctx context.Context, idDPM primitive.ObjectID) (*types.Department, error)

	InsertSection(ctx context.Context, s types.Section) error
	GetListSection(ctx context.Context, idDPM string) ([]*types.Section, error)
	FindByNameSection(ctx context.Context, name string) (*types.Section, error)
	FindBySectionNameId(ctx context.Context, name string, id primitive.ObjectID) (*types.Section, error)
	Disable(ctx context.Context, idDMP primitive.ObjectID, disable bool) error
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

func (s *Service) AddSrv(ctx context.Context, Department types.Department) (*types.Department, error) {

	if _, err := s.repo.FindByName(ctx, Department.Name); err == nil {
		s.logger.Errorf("Email email exits %v", err)
		return nil, errors.Wrap(errors.New("Code exits"), "Email exits, can't insert user")
	}

	dpm := types.Department{
		ID:       primitive.NewObjectID(),
		Name:     Department.Name,
		CreateAt: time.Now(),
		UpdateAt: time.Now()}

	if err := s.repo.Insert(ctx, dpm); err != nil {
		s.logger.Errorf("Can't insert dmp %v", err)
		return nil, errors.Wrap(err, "Can't insert dpm")
	}

	return &dpm, nil

}

func (s *Service) ListSrv(ctx context.Context) ([]*types.Department, error) {

	dmps, err := s.repo.GetList(ctx)
	if err != nil {
		s.logger.Errorf("Can't get dmps %v", err)
		return nil, errors.Wrap(err, "Can't insert dpm")
	}

	return dmps, nil
}

func (s *Service) AddSection(ctx context.Context, S types.Section) (*types.Section, error) {

	a, err := s.repo.FindByID(ctx, S.DepartmentID)
	if err != nil {
		s.logger.Errorf("DepartmentID not exits %v", err)
		return nil, errors.Wrap(errors.New("Code exits"), "DepartmentID not, can't insert user")
	}

	if _, err := s.repo.FindBySectionNameId(ctx, S.Name, S.DepartmentID); err == nil {
		s.logger.Errorf("Section exits %v", err)
		return nil, errors.Wrap(errors.New("Code exits"), "Section exits")
	}

	sc := types.Section{
		ID:             primitive.NewObjectID(),
		Name:           S.Name,
		DepartmentName: a.Name,
		DepartmentID:   a.ID,
		CreateAt:       time.Now(),
		UpdateAt:       time.Now()}

	if err := s.repo.InsertSection(ctx, sc); err != nil {
		s.logger.Errorf("Can't insert sc %v", err)
		return nil, errors.Wrap(err, "Can't insert sc")
	}

	return &sc, nil

}

func (s *Service) GetListSection(ctx context.Context, idDMP string) ([]*types.Section, error) {

	ss, err := s.repo.GetListSection(ctx, idDMP)
	if err != nil {
		s.logger.Errorf("Can't get ss %v", err)
		return nil, errors.Wrap(err, "Can't insert dpm")
	}

	return ss, nil
}

func (s *Service) Disable(ctx context.Context, idDMP primitive.ObjectID, disable bool) error {

	err := s.repo.Disable(ctx, idDMP, disable)
	if err != nil {
		s.logger.Errorf("Can't Disable ss %v", err)
		return errors.Wrap(err, "Can't Disable dpm")
	}

	return nil
}

func (s *Service) TestS(ctx context.Context) string {
	return fmt.Sprintf("%s %s ", "S ", s.repo.Test(ctx))
}
