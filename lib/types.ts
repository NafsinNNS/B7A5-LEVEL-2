export type TApiResponse<T> = {
  success: boolean;
  statusCode?: number;
  message: string;
  data: T;
  meta?: unknown;
  error?: unknown;
};

export type TPaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type TRole = "TENANT" | "LANDLORD" | "ADMIN";

export type TUser = {
  id: string;
  name: string;
  email: string;
  role: TRole;
  activeStatus: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
};

export type TCategory = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type TProperty = {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  amenities: string[];
  categoryName: string;
  isAvailable: boolean;
  landlordId: string;
  createdAt: string;
  updatedAt: string;
};

export type TApproveStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "COMPLETED";

export type TPaymentStatus = "UNPAID" | "PAID" | "FAILED";

export type TRentalRequest = {
  id: string;
  userId: string;
  propertyId: string;
  approveStatus: TApproveStatus;
  paymentStatus: TPaymentStatus;
  createdAt: string;
  updatedAt: string;
  property?: TProperty;
  user?: Pick<TUser, "id" | "name" | "email">;
  payment?: TPayment;
};

export type TPayment = {
  id: string;
  amount: number;
  status: "ACTIVE" | "INACTIVE" | "CANCELLED" | "EXPIRED";
  stripeCustomerId: string;
  stripePaymentId: string;
  currentPeriodEnd: string;
  userId: string;
  rentalRequestId: string;
  createdAt: string;
  updatedAt: string;
  rentalRequest?: TRentalRequest;
};

export type TReview = {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  userId: string;
  propertyId: string;
  user?: TUser;
  property?: TProperty;
};

export type TPropertyQuery = {
  searchTerm?: string;
  title?: string;
  price?: string;
  maxPrice?: string;
  location?: string;
  categoryName?: string;
  sortBy?: string;
  sortOrder?: string;
};
