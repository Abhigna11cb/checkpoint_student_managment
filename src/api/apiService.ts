const BASE_URL = 'http://Student-system-env.eba-24yuymwa.us-west-2.elasticbeanstalk.com/api/v1';
export const AUTH_TOKEN_STORAGE_KEY = 'auth_token';
const TOKEN_STORAGE_KEY = AUTH_TOKEN_STORAGE_KEY;

const defaultHeaders: Record<string, string> = {
  'Content-Type': 'application/json'
};

const getAuthHeader = (): Record<string, string> => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (!token) {
    return {};
  }
  return { Authorization: `Bearer ${token}` };
};

type ApiEnvelope<T> = {
  data: T;
  message?: string;
  [key: string]: unknown;
};

type ApiErrorPayload = {
  message?: string;
  error?: string;
  errors?: string[];
  [key: string]: unknown;
};

const isJsonResponse = (headers: Headers): boolean => {
  const contentType = headers.get('content-type');
  return Boolean(contentType && contentType.includes('application/json'));
};

const isApiEnvelope = (payload: unknown): payload is ApiEnvelope<unknown> => {
  return typeof payload === 'object' && payload !== null && 'data' in payload;
};

async function handleResponse<T>(response: Response, unwrapData: boolean): Promise<T> {
  const isJson = isJsonResponse(response.headers);
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const body = payload as ApiErrorPayload;
    const message =
      typeof payload === 'string'
        ? payload
        : body?.message || body?.error || (Array.isArray(body?.errors) ? body.errors[0] : undefined);
    throw new Error(message || 'Something went wrong. Please try again.');
  }

  if (unwrapData && isJson && isApiEnvelope(payload)) {
    return (payload as ApiEnvelope<T>).data;
  }

  return payload as T;
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  requiresAuth = false,
  unwrapData = true
): Promise<T> {
  const headers: HeadersInit = {
    ...defaultHeaders,
    ...options.headers,
    ...(requiresAuth ? getAuthHeader() : {})
  };

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers
  });

  return handleResponse<T>(response, unwrapData);
}

export interface UserSummary {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  address?: string;
  [key: string]: unknown;
}

export interface LoginResponse {
  token: string;
  user?: UserSummary;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: 'student' | 'admin';
}

export interface ProfileData {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  bio?: string;
  enrollmentYear?: number;
  [key: string]: unknown;
}

export const login = (email: string, password: string) => {
  return request<LoginResponse>(
    '/auth/login',
    {
      method: 'POST',
      body: JSON.stringify({ email, password })
    },
    false,
    false
  );
};

export const register = ({ name, email, password, role = 'student' }: RegisterPayload) => {
  return request<LoginResponse | { message?: string }>(
    '/auth/register',
    {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role })
    },
    false,
    false
  );
};

export const getMyProfile = () => {
  return request<ProfileData>('/users/me', { method: 'GET' }, true);
};

export const upsertMyProfile = (profileData: ProfileData) => {
  return request<ProfileData>(
    '/users/me/profile',
    {
      method: 'POST',
      body: JSON.stringify(profileData)
    },
    true
  );
};

export const getAllUsers = () => {
  return request<UserSummary[]>('/users/all', { method: 'GET' }, true);
};

export interface StudentPayload {
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

export const createStudent = (payload: StudentPayload) => {
  return request<UserSummary>(
    '/admin/students',
    {
      method: 'POST',
      body: JSON.stringify(payload)
    },
    true
  );
};

export const updateStudent = (id: string, payload: Partial<StudentPayload>) => {
  return request<UserSummary>(
    `/admin/students/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify(payload)
    },
    true
  );
};

export const deleteStudent = (id: string) => {
  return request<{ message: string }>(
    `/admin/students/${id}`,
    {
      method: 'DELETE'
    },
    true
  );
};

export interface CoursePayload {
  name: string;
  description: string;
  details?: string;
  startDate: string;
  endDate: string;
}

export interface Course extends CoursePayload {
  id: string;
  status?: string;
}

export const getCourses = () => {
  return request<Course[]>('/courses', { method: 'GET' }, true);
};

export const createCourse = (payload: CoursePayload) => {
  return request<Course>(
    '/courses',
    {
      method: 'POST',
      body: JSON.stringify(payload)
    },
    true
  );
};

export const updateCourse = (id: string, payload: Partial<CoursePayload>) => {
  return request<Course>(
    `/courses/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify(payload)
    },
    true
  );
};

export const deleteCourse = (id: string) => {
  return request<{ message: string }>(
    `/courses/${id}`,
    {
      method: 'DELETE'
    },
    true
  );
};

export interface EnrollmentRequestPayload {
  courseId: string;
}

export interface EnrollmentSummary {
  id: string;
  courseId?: string;
  courseName: string;
  studentName?: string;
  studentId?: string;
  studentEmail?: string;
  status: string;
  requestedAt?: string;
  startDate?: string;
}

export const requestEnrollment = (payload: EnrollmentRequestPayload) => {
  return request<EnrollmentSummary>(
    '/enrollments/request',
    {
      method: 'POST',
      body: JSON.stringify(payload)
    },
    true
  );
};

export const getMyCourses = () => {
  return request<EnrollmentSummary[]>('/enrollments/my-requests', { method: 'GET' }, true);
};

export const getEnrollmentRequests = () => {
  return request<EnrollmentSummary[]>('/enrollments/pending', { method: 'GET' }, true);
};

export const approveEnrollment = (enrollmentId: string) => {
  return request<{ message: string }>(
    '/admin/enrollments/approve',
    {
      method: 'POST',
      body: JSON.stringify({ enrollmentId })
    },
    true
  );
};

export const rejectEnrollment = (enrollmentId: string) => {
  return request<{ message: string }>(
    '/admin/enrollments/reject',
    {
      method: 'POST',
      body: JSON.stringify({ enrollmentId })
    },
    true
  );
};

export const assignEnrollment = (studentId: string, courseId: string) => {
  return request<{ message: string }>(
    '/admin/enrollments/assign',
    {
      method: 'POST',
      body: JSON.stringify({ studentId, courseId })
    },
    true
  );
};


