import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";
import type { Member } from "@/members/models/member.model";
import { BaseEntity } from "@/common/entities/base.entity";

@Entity({ name: "members" })
export class MemberEntity extends BaseEntity implements Member {
  @Column({ type: "varchar", length: 100 })
  name: string;

  /** Stored lower-cased by MemberService, so a plain unique index is enough. */
  @Column({ type: "varchar", length: 255, unique: true })
  email: string;
}
