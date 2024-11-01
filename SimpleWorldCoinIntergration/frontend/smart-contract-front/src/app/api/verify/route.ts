import { type IVerifyResponse, verifyCloudProof } from '@worldcoin/idkit'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const app_id = process.env.APP_ID
  const action = process.env.ACTION_ID
	const { merkle_root, proof, verification_level, nullifier_hash } = await req.json();
	console.log("test log", app_id)

	const response = await fetch(`https://developer.worldcoin.org/api/v2/verify/${app_id}`, {
		method: 'POST',
		headers: {
				'Content-Type': 'application/json',
		},
		body: JSON.stringify({merkle_root, proof, verification_level, nullifier_hash, action }),
	});

	// Parse the JSON response
	const responseData = await response.json();

	// Return the parsed response
	return NextResponse.json(responseData);
};
