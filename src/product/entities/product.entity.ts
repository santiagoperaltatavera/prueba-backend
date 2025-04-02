import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    name!: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    price!: number;

    @Column({ type: 'int', default: 0 })
    stock!: number;
}