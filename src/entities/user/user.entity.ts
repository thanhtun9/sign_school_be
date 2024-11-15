import { EntityNameConst } from 'src/constant/entity-name';
import { DBColumn } from 'src/decorator/swagger.decorator';
import { AppStatus } from 'src/types/common';
import { StringUtil } from 'src/utils/string';
import { BeforeInsert, BeforeUpdate, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { ClassRoom } from '../class/classroom.entity';
import { AbstractTimeEntity } from '../entity.interface';
import { EXAM } from '../exam/exam.entity';
import { Role } from '../role/role.entity';
import { Upload } from '../upload/upload.entity';
import { VocabularyView } from '../vocabulary/vocabulary-view.entity';
import { Vocabulary } from '../vocabulary/vocabulary.entity';
import { ExamAttempt } from './../exam/exam-attempt.entity';
import { UserLog } from './user-log.entity';
import { Question } from '../question/question.entity';
import { ClassStudent } from '../class/class-student.entity';
import { Gender } from 'src/constant/enum-common';

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity(EntityNameConst.USER)
export class User extends AbstractTimeEntity {
  @DBColumn({
    name: 'username',
    type: 'varchar',
    nullable: true,
    unique: true,
  })
  username: string;

  @DBColumn({
    name: 'password',
    type: 'varchar',
    nullable: true,
  })
  password: string;

  @DBColumn({
    name: 'name',
    type: 'varchar',
    nullable: true,
  })
  name: string;

  @DBColumn({
    name: 'avatar_location',
    type: 'varchar',
    nullable: true,
  })
  avatarLocation: string;

  @DBColumn({
    name: 'email',
    type: 'varchar',
    nullable: true,
  })
  email: string;

  @DBColumn({
    name: 'phone_number',
    type: 'varchar',
    nullable: true,
  })
  phoneNumber: string;

  @DBColumn({
    name: 'address',
    type: 'varchar',
    nullable: true,
  })
  address: string;

  @DBColumn({ type: 'timestamptz', name: 'birthday', nullable: true })
  birthday: string;

  @DBColumn({ type: 'enum', name: 'gender', enum: Gender, default: Gender.MALE })
  gender: Gender;

  @DBColumn({ type: 'boolean', name: 'is_super_admin', default: false })
  isSupperAdmin: boolean;

  @DBColumn({ type: 'int', name: 'role_id', nullable: true })
  roleId: number;

  @DBColumn({ name: 'slug', type: 'varchar', nullable: true })
  slug: string;

  @DBColumn({ name: 'status', type: 'enum', enum: AppStatus, default: AppStatus.APPROVED })
  status: AppStatus;

  // RELATIONSHIP
  @ManyToOne(() => Role, (role) => role.users, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @OneToMany(() => Upload, (upload) => upload.creator)
  uploads: Upload[];

  @OneToMany(() => UserLog, (userLog) => userLog.user)
  userLogs: UserLog[];

  @OneToMany(() => VocabularyView, (vocabularyView) => vocabularyView.student)
  vocabularyViews: VocabularyView[];

  @OneToMany(() => Vocabulary, (vocabulary) => vocabulary.creator)
  vocabularies: Vocabulary[];

  @OneToOne(() => ClassRoom, (vocabulary) => vocabulary.teacher)
  classroomTeacher: ClassRoom;

  @OneToMany(() => EXAM, (exam) => exam.creator)
  exams: EXAM[];

  @OneToMany(() => ExamAttempt, (examAttempt) => examAttempt.student)
  examAttempts: ExamAttempt[];

  @OneToMany(() => Question, (question) => question.creator)
  questions: Question[];

  @OneToMany(() => ClassStudent, (classStudent) => classStudent.student)
  classStudents: ClassStudent[];

  @BeforeInsert()
  handleBeforeInsert() {
    this.slug = StringUtil.createSlug(this.name);
  }

  @BeforeUpdate()
  handleBeforeUpdate() {
    this.slug = StringUtil.createSlug(this.name);
  }
}
