import { ethers } from 'hardhat';
import { makeAbi } from './abiGenerator';

async function main() {
  const tokenContractName = 'AttendanceToken';
  const questionListName = 'QuestionList';

  console.log(`Deploying contracts`);

  const tokenContractFactory =
    await ethers.getContractFactory(tokenContractName); // tokenContractName 배포할 준비; 즉 tokenContractName 컨트랙트를 설계도로 가져옴 
  const tokenContract = await tokenContractFactory.deploy();
  await tokenContract.waitForDeployment();

  const questionListFactory = await ethers.getContractFactory(questionListName);
  const questionList = await questionListFactory.deploy(tokenContract.target);
  await questionList.waitForDeployment();

  console.log(`${tokenContractName} deployed at: ${tokenContract.target}`);
  console.log(`${questionListName} deployed at: ${questionList.target}`);

  await makeAbi(`${tokenContractName}`, tokenContract.target);
  await makeAbi(`${questionListName}`, questionList.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


// 아래는 처음에 두 컨트랙트랄 하나의 json 파일로 배포한 코드 

// 두 컨트랙트가 순서대로 배포되고, 
// 그 중 하나(Questionlist)는 다른 컨트랙트(Attendance)의 주소를 받아야 한다

// import { ethers } from 'hardhat';
// import { makeCombinedAbi } from './abiGenerator';

// async function main() {
//   const AttendanceFactory = await ethers.getContractFactory('Attendance');  // Attendance를 배포할 준비; 즉 'Attendance'라는 이름의 컨트랙트를 설계도로 가져옴
//   console.log('Deploying Attendance...');
//   const attendance = await AttendanceFactory.deploy();  // 실제로 EVM에 배포 
//   await attendance.waitForDeployment();  // tx이 확정될 때까지 기다림 
//   console.log(`Attendance deployed at: ${attendance.target}`); // 배포된 주소 콘솔에 출력

//   const QuestionlistFactory = await ethers.getContractFactory('Questionlist');
//   console.log('Deploying Questionlist...');
//   // Questionlist는 생성자에서 Attendance 주소를 받아야 하므로 바로 전달
//   // attendance.target은 바로 앞에 배포한 Attendance의 컨트랙트 주소 
//   // 즉 attendance는 Contract 객체이고, attendance.target은 그 객체가 배포된 EVM 상의 주소
//   // 참고: Hardhat 2.17 이후에는 .address 대신 .target을 사용함 
//   // 그러니까 아래 코드의 의미는: "Attendance 컨트랙트를 먼저 배포했고, 그 주소를 사용해서 Questionlist 컨트랙트를 생성자 인자로 전달하며 배포합니다."
//   const questionlist = await QuestionlistFactory.deploy(attendance.target);
//   await questionlist.waitForDeployment();
//   console.log(`Questionlist deployed at: ${questionlist.target}`);

//   // 하나의 ABI 파일로 저장 
//   await makeCombinedAbi([
//     { name: 'Attendance', address: attendance.target },
//     { name: 'Questionlist', address: questionlist.target },
//   ]);
// }

// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });

