// AttendanceStatus 라는 이름의 enum 타입 정의 
// export라는 키워드를 써서 다른 파일에서 import 할 수 있게 함 
// 왜 필요? => 코드에서 AttendanceStatus.Attendance_Success 처럼 읽기 쉽게 사용할 수 있고, 오타방지할 수 있다.
export enum AttendanceStatus {
    Wallet_Load_Failed = 'Wall_Load_Failed',
    Attendance_Success = 'Attendance_Success',
    Attendance_Failed = 'Attendance_Failed',
    Daily_Limit = 'Daily_Limit',
}
