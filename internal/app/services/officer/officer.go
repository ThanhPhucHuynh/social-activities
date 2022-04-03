package officerServices

import (
	"context"
	"fmt"
	"time"

	"social-activities/internal/app/types"
	"social-activities/internal/pkg/config"
	"social-activities/internal/pkg/glog"
	"social-activities/internal/pkg/jwt"

	"github.com/pkg/errors"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Repository interface {
	Test(ctx context.Context) string
	FindByCode(ctx context.Context, code string) (*types.Officer, error)
	FindByEmail(ctx context.Context, email string) (*types.Officer, error)
	Insert(ctx context.Context, user types.Officer) error
	GetAll(ctx context.Context) ([]*types.Officer, error)
	Update(ctx context.Context, user types.Officer) error
	ResetPW(ctx context.Context, user types.Officer) error
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

func (s *Service) RegisterSrv(ctx context.Context, userLogin types.Officer) (*types.UserResponseSignUp, error) {

	if _, err := s.repo.FindByCode(ctx, userLogin.Code); err == nil {
		s.logger.Errorf("Code  exits %v", err)
		return nil, errors.Wrap(errors.New("Code exits"), "Code exits, can't insert user")
	}
	if _, err := s.repo.FindByEmail(ctx, userLogin.Email); err == nil {
		s.logger.Errorf("Email email exits %v", err)
		return nil, errors.Wrap(errors.New("Email exits"), "Email exits, can't insert user")
	}

	userLogin.Password, _ = jwt.HashPassword(userLogin.Password)
	officer := types.Officer{
		ID:       primitive.NewObjectID(),
		Name:     userLogin.Name,
		Email:    userLogin.Email,
		Password: userLogin.Password,
		Code:     userLogin.Code,
		Birthday: time.Now(),
		Avatar:   userLogin.Avatar,
		Gender:   userLogin.Gender,
		Country:  userLogin.Country,
		Phone:    userLogin.Phone,
		Salary:   0.0,
		Role:     "none",
		CreateAt: time.Now(),
		UpdateAt: time.Now()}

	if err := s.repo.Insert(ctx, officer); err != nil {
		s.logger.Errorf("Can't insert user %v", err)
		return nil, errors.Wrap(err, "Can't insert user")
	}

	var tokenString string
	tokenString, err := jwt.GenToken(types.OfficerInToken{
		ID:    officer.ID,
		Name:  officer.Name,
		Email: officer.Email,
	}, s.conf.Jwt.Duration)

	if err != nil {
		s.logger.Errorf("Can't gen token after insert %v", err)
		return nil, errors.Wrap(err, "Can't insert user")
	}
	s.logger.Infof("Register completed", officer)

	return &types.UserResponseSignUp{
		ID:     officer.ID,
		Name:   officer.Name,
		Email:  officer.Email,
		Code:   officer.Code,
		Avatar: officer.Avatar,
		Role:   officer.Role,
		Token:  tokenString}, nil

}

func (s *Service) LoginSrv(ctx context.Context, userLogin types.OfficerLogin) (*types.UserResponseSignUp, error) {

	user, err := s.repo.FindByEmail(ctx, userLogin.Email)
	if err != nil {
		s.logger.Errorf("Email email exits %v", err)
		return nil, errors.Wrap(errors.New("Code exits"), "Email not exists, can't find officer")
	}

	if !jwt.IsCorrectPassword(userLogin.Password, user.Password) {
		s.logger.Errorf("Password incorrect %v", userLogin.Email)
		return nil, errors.Wrap(errors.New("Password isn't like password from database"), "Password incorrect")
	}

	var tokenString string
	tokenString, error := jwt.GenToken(types.OfficerInToken{
		ID:    user.ID,
		Name:  user.Name,
		Code:  user.Code,
		Email: user.Email}, s.conf.Jwt.Duration)

	if error != nil {
		s.logger.Errorf("Can not gen token %v", error)
		return nil, errors.Wrap(error, "Can't gen token")
	}
	s.logger.Infof("Login completed ", user.Email)
	return &types.UserResponseSignUp{
		Name:   user.Name,
		Email:  user.Email,
		ID:     user.ID,
		Code:   user.Code,
		Avatar: user.Avatar,
		Role:   user.Role,
		Token:  tokenString}, nil
}

func (s *Service) MeSrv(ctx context.Context, email string) (*types.Officer, error) {

	user, err := s.repo.FindByEmail(ctx, email)
	if err != nil {
		s.logger.Errorf("Email email exits %v", err)
		return nil, errors.Wrap(errors.New("Code exits"), "Email not exists, can't find officer")
	}
	user.Password = ""
	s.logger.Infof("MeSrv completed ", user.Email)
	return user, nil
}

func (s *Service) List(ctx context.Context) ([]*types.Officer, error) {

	users, err := s.repo.GetAll(ctx)
	if err != nil {
		s.logger.Errorf("GetAll failed %v", err)
		return nil, errors.Wrap(errors.New("GetAll failed"), "")
	}
	s.logger.Infof("get list completed ")
	return users, nil
}

func (s *Service) ResetPW(ctx context.Context, email string) error {

	user, err := s.repo.FindByEmail(ctx, email)
	if err != nil {
		s.logger.Errorf("Email email exits %v", err)
		return errors.Wrap(errors.New("Code exits"), "Email not exists, can't find officer")
	}
	user.Password, _ = jwt.HashPassword("xxxx")
	if err := s.repo.ResetPW(ctx, *user); err != nil {
		s.logger.Errorf("can't reset pw %v", err)
		return errors.Wrap(errors.New("can't reset pw"), "can't reset pw")
	}
	s.logger.Infof("reset completed ", user.Email)
	return nil
}

func (s *Service) ChangePW(ctx context.Context, email string, pw string) error {
	user, err := s.repo.FindByEmail(ctx, email)
	if err != nil {
		s.logger.Errorf("Email email exits %v", err)
		return errors.Wrap(errors.New("Code exits"), "Email not exists, can't find officer")
	}
	p, _ := jwt.HashPassword(pw)

	officer := types.Officer{
		ID:       user.ID,
		Password: p,
		UpdateAt: time.Now()}
	if err := s.repo.ResetPW(ctx, officer); err != nil {
		s.logger.Errorf("can't change pw %v", err)
		return errors.Wrap(errors.New("can't change pw"), "can't change pw")
	}
	s.logger.Infof("change pw completed ", user.Email)
	return nil
}
