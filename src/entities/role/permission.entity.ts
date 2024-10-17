import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractIdEntity } from '../entity.interface';
import { RolePermission } from './role-permission.entity';

@Entity()
export class Permission extends AbstractIdEntity {
  @Column({ type: 'varchar', name: 'code', unique: true })
  code: string;

  @Column({ type: 'varchar', name: 'name' })
  name: string;

  @Column({ type: 'boolean', name: 'is_active', default: true })
  isActive: boolean;

  @OneToMany(() => RolePermission, (rolePermission) => rolePermission.role)
  rolePermissions: RolePermission[];
}
