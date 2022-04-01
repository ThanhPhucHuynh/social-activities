package departmentServices

import (
	"context"
	"fmt"

	"social-activities/internal/pkg/config"
	"social-activities/internal/pkg/glog"
)

type Repository interface {
	Test(ctx context.Context) string
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
