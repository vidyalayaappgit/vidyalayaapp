import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const formId = searchParams.get('formId');
  
  console.log('API route called with formId:', formId);
  
  // Return the status options from your database
  const statusOptions = [
    { id: 1, status_id: 1, status_name: 'DRAFT', status_desc: 'Subject in draft mode - not yet ready for use' },
    { id: 2, status_id: 2, status_name: 'ACTIVE', status_desc: 'Subject is active and available for use' },
    { id: 3, status_id: 3, status_name: 'INACTIVE', status_desc: 'Subject is inactive/archived' },
  ];
  
  return NextResponse.json({
    success: true,
    data: statusOptions,
    message: 'Status options fetched successfully'
  });
}