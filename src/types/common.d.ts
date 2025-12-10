declare interface IOcean {
	O: number;
	C: number;
	E: number;
	A: number;
	N: number;
}

declare interface IUser {
	id: string;
	username: string;
	email: string;
	phoneNumber: null;
	fullName: string;
	gender: string;
	location: string;
	role: string;
	dateOfBirth: Date;
	createdAt: Date;
	updatedAt: Date;
}

declare interface IUserCamelCase {
	id: string;
	username: string;
	email: string;
	phoneNumber: null;
	fullName: string;
	gender: string;
	location: string;
	role: string;
	dateOfBirth: Date;
	createdAt: Date;
	updatedAt: Date;
}

declare interface IUserSnakeCase {
	id: string;
	username: string;
	email: string;
	phone_number: null;
	full_name: string;
	gender: string;
	role: string;
	date_of_birth: Date;
	age: number;
	location: string;
	created_at: Date;
	updated_at: Date;
}