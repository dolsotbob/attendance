import fs from 'fs';
import path from 'path';
import type * as ethers from 'ethers';

const basePath = __dirname;
const base = path.join(basePath, '../');

export const makeCombinedAbi = async (
  contracts: { name: string; address: string | ethers.Addressable }[],
  outputFilename = 'combinedAbis.json'
) => {
  const combined: Record<string, any> = {};

  for (const { name, address } of contracts) {
    const jsonPath = path.join(
      base,
      `/artifacts/contracts/${name}.sol/${name}.json`,
    );
    const json = fs.readFileSync(jsonPath, 'utf-8');
    const parsed = JSON.parse(json);

    combined[name] = {
      abi: parsed.abi,
      address: address,
    };
  }

  // 저장할 경로 목록 
  const outputPaths = [
    path.resolve(base, 'abis', outputFilename),
    path.resolve(base, '../att_front/src/utils', outputFilename),
  ];
  console.log('✅ outputPaths:', outputPaths);

  // 파일 두 군데 저장 
  for (const outputPath of outputPaths) {
    const dir = path.dirname(outputPath);

    // 디렉토리 존재하지 않으면 생성 
    if (!fs.existsSync(dir)) {
      console.log(`📁 Creating directory: ${dir}`);
      fs.mkdirSync(dir, { recursive: true });
    }

    console.log('📄 Writing ABI to:', outputPath);
    fs.writeFileSync(outputPath, JSON.stringify(combined, null, 2));
  }

  console.log(`✅ ABI combined file created at: ${outputPaths[0]}`);
};

