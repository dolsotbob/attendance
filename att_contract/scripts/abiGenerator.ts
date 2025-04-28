import fs from 'fs';
import path from 'path';
import type * as ethers from 'ethers';

const basePath = __dirname;

let base = path.join(basePath, '../');

const makeFile = async (
  location: string,
  destination: string,
  address: string | ethers.Addressable
) => {
  console.log(
    '다음 경로에 abi파일을 만듭니다. : ',
    path.join(base, destination)
  );
  const json = fs.readFileSync(path.join(base, location), {
    encoding: 'utf-8'
  });

  fs.writeFileSync(path.join(base, destination), makeData(json, address));
};

const makeData = (json: string, address: string | ethers.Addressable) => {
  const abi = JSON.parse(json).abi;

  return JSON.stringify({
    abi: abi,
    address: address,
  });
};

export const makeAbi = async (
  contract: string,
  address: string | ethers.Addressable
) => {
  await makeFile(
    `/artifacts/contracts/${contract}.sol/${contract}.json`,
    `/abis/${contract}.json`,
    address
  );
};

// 아래는 처음 만든 파일 

// export const makeCombinedAbi = async (
//   contracts: { name: string; address: string | ethers.Addressable }[],
//   outputFilename = 'combinedAbis.json'
// ) => {
//   const combined: Record<string, any> = {};

//   for (const { name, address } of contracts) {
//     const jsonPath = path.join(
//       base,
//       `/artifacts/contracts/${name}.sol/${name}.json`,
//     );
//     const json = fs.readFileSync(jsonPath, 'utf-8');
//     const parsed = JSON.parse(json);

//     combined[name] = {
//       abi: parsed.abi,
//       address: address,
//     };
//   }

//   // 저장할 경로 목록 
//   const outputPaths = [
//     path.resolve(base, 'abis', outputFilename),
//     path.resolve(base, '../att_front/src/utils', outputFilename),
//   ];
//   console.log('✅ outputPaths:', outputPaths);

//   // 파일 두 군데 저장 
//   for (const outputPath of outputPaths) {
//     const dir = path.dirname(outputPath);

//     // 디렉토리 존재하지 않으면 생성 
//     if (!fs.existsSync(dir)) {
//       console.log(`📁 Creating directory: ${dir}`);
//       fs.mkdirSync(dir, { recursive: true });
//     }

//     console.log('📄 Writing ABI to:', outputPath);
//     fs.writeFileSync(outputPath, JSON.stringify(combined, null, 2));
//   }

//   console.log(`✅ ABI combined file created at: ${outputPaths[0]}`);
// };

