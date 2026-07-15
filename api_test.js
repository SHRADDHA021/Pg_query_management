const BASE_URL = 'http://localhost:8080/api';

async function runTests() {
  console.log('=== PG Management API End-to-End Test ===\n');

  try {
    // 1. Login as Admin
    console.log('1. Logging in as Admin...');
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'Admin@123' })
    });
    
    if (!loginRes.ok) {
      throw new Error(`Admin login failed: ${loginRes.status} ${await loginRes.text()}`);
    }
    
    const loginData = await loginRes.json();
    const adminToken = loginData.data.token;
    console.log('✓ Admin login successful!');
    console.log(`  Token: ${adminToken.substring(0, 20)}...\n`);

    // 2. Fetch Rooms
    console.log('2. Fetching available rooms...');
    const roomsRes = await fetch(`${BASE_URL}/rooms`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const roomsData = await roomsRes.json();
    const rooms = roomsData.data;
    console.log(`✓ Rooms fetched. Total rooms found: ${rooms.length}`);
    const firstRoom = rooms[0];
    console.log(`  Selected Room for test: Room ${firstRoom.roomNumber} (ID: ${firstRoom.id}, Capacity: ${firstRoom.capacity}, Occupied: ${firstRoom.occupiedCount})\n`);

    // 3. Create Student as Admin
    console.log('3. Creating a new student...');
    const testUsername = `test_student_${Date.now()}`;
    const createStudentRes = await fetch(`${BASE_URL}/admin/students`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        name: 'Test Automation Resident',
        username: testUsername,
        password: 'Password@123',
        phone: '1234567890',
        age: 22,
        address: '123 Automation Lane, Tech City',
        emergencyContact: '0987654321',
        rentStatus: 'Pending',
        roomId: firstRoom.id
      })
    });

    if (!createStudentRes.ok) {
      throw new Error(`Create student failed: ${createStudentRes.status} ${await createStudentRes.text()}`);
    }

    const createdStudentData = await createStudentRes.json();
    const student = createdStudentData.data;
    console.log(`✓ Student created successfully!`);
    console.log(`  Name: ${student.name}`);
    console.log(`  Username: ${student.username}`);
    console.log(`  Room Number: ${student.roomNumber} (ID: ${student.roomId})\n`);

    // 4. Verify Room Occupancy Incremented
    console.log('4. Verifying room occupancy incremented...');
    const roomCheckRes = await fetch(`${BASE_URL}/rooms/${firstRoom.id}`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const roomCheckData = await roomCheckRes.json();
    const updatedRoom = roomCheckData.data;
    console.log(`✓ Occupancy verified: Room ${updatedRoom.roomNumber} occupied count is now ${updatedRoom.occupiedCount} (was ${firstRoom.occupiedCount})\n`);

    // 5. Authenticate as New Student
    console.log('5. Logging in as the new student...');
    const studentLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: testUsername, password: 'Password@123' })
    });

    if (!studentLoginRes.ok) {
      throw new Error(`Student login failed: ${studentLoginRes.status} ${await studentLoginRes.text()}`);
    }

    const studentLoginData = await studentLoginRes.json();
    const studentToken = studentLoginData.data.token;
    console.log('✓ Student login successful!');
    console.log(`  Token: ${studentToken.substring(0, 20)}...\n`);

    // 6. Submit a Complaint as Student
    console.log('6. Submitting a complaint as student...');
    const createComplaintRes = await fetch(`${BASE_URL}/complaints`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${studentToken}`
      },
      body: JSON.stringify({
        category: 'ELECTRICAL',
        description: 'The ceiling fan in room is making clicking noise and running slow.'
      })
    });

    if (!createComplaintRes.ok) {
      throw new Error(`Complaint submission failed: ${createComplaintRes.status} ${await createComplaintRes.text()}`);
    }

    const complaintData = await createComplaintRes.json();
    const complaint = complaintData.data;
    console.log(`✓ Complaint submitted successfully!`);
    console.log(`  ID: ${complaint.id}`);
    console.log(`  Category: ${complaint.category}`);
    console.log(`  Status: ${complaint.status}`);
    console.log(`  Description: ${complaint.description}\n`);

    // 7. Get My Complaints as Student
    console.log('7. Viewing my complaints as student...');
    const myComplaintsRes = await fetch(`${BASE_URL}/complaints/my`, {
      headers: { 'Authorization': `Bearer ${studentToken}` }
    });
    const myComplaintsData = await myComplaintsRes.json();
    console.log(`✓ Retrieved ${myComplaintsData.data.length} complaints for student.`);
    console.log(`  First Complaint ID: ${myComplaintsData.data[0].id}\n`);

    // 8. Update Complaint Status as Admin
    console.log('8. Updating complaint status as Admin...');
    const updateStatusRes = await fetch(`${BASE_URL}/complaints/${complaint.id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        status: 'IN_PROGRESS',
        adminNote: 'Electrician has been assigned. Scheduled to visit tomorrow morning.'
      })
    });

    if (!updateStatusRes.ok) {
      throw new Error(`Complaint status update failed: ${updateStatusRes.status} ${await updateStatusRes.text()}`);
    }

    const updatedComplaintData = await updateStatusRes.json();
    const updatedComplaint = updatedComplaintData.data;
    console.log(`✓ Complaint status updated successfully by Admin!`);
    console.log(`  New Status: ${updatedComplaint.status}`);
    console.log(`  Admin Note: "${updatedComplaint.adminNote}"\n`);

    // 9. Reassign Student Room (Verification of Partial Update bug fix)
    console.log('9. Reassigning student room (Testing partial update safety)...');
    // Let's find another room to assign
    const secondRoom = rooms.find(r => r.id !== firstRoom.id && r.occupiedCount < r.capacity);
    if (!secondRoom) {
      console.log('  No other vacant room found. Skipping reassignment test.');
    } else {
      console.log(`  Targeting Room: Room ${secondRoom.roomNumber} (ID: ${secondRoom.id})`);
      const reassignRes = await fetch(`${BASE_URL}/admin/students/${student.id}/room`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ roomId: secondRoom.id })
      });

      if (!reassignRes.ok) {
        throw new Error(`Room reassignment failed: ${reassignRes.status} ${await reassignRes.text()}`);
      }

      const reassignedStudentData = await reassignRes.json();
      const reassignedStudent = reassignedStudentData.data;
      console.log(`✓ Room reassigned successfully!`);
      console.log(`  New Room: ${reassignedStudent.roomNumber}`);
      console.log(`  Checking student personal details integrity (post-fix check):`);
      console.log(`  Name: "${reassignedStudent.name}" (Expected: "Test Automation Resident")`);
      console.log(`  Phone: "${reassignedStudent.phone}" (Expected: "1234567890")`);
      console.log(`  Age: "${reassignedStudent.age}" (Expected: "22")`);

      if (reassignedStudent.name !== 'Test Automation Resident' || reassignedStudent.phone !== '1234567890') {
        throw new Error('CRITICAL BUG DETECTED: Student personal details were wiped out during room reassignment!');
      } else {
        console.log('  ✓ Personal details intact. Fix verified!\n');
      }
    }

    // 10. Delete Test Student as Admin (Cleanup)
    console.log('10. Cleaning up: Deleting test student...');
    const deleteRes = await fetch(`${BASE_URL}/admin/students/${student.id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });

    if (!deleteRes.ok) {
      throw new Error(`Delete student failed: ${deleteRes.status} ${await deleteRes.text()}`);
    }
    console.log('✓ Test student deleted successfully.');
    console.log('✓ Cleanup complete!\n');

    console.log('==========================================');
    console.log('🎉 ALL TESTS PASSED SUCCESSFULLY! 🎉');
    console.log('==========================================');

  } catch (error) {
    console.error('\n❌ TEST FAILED:');
    console.error(error);
    process.exit(1);
  }
}

runTests();
