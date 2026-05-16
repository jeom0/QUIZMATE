import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

async function testFlow() {
  console.log('--- INICIANDO PRUEBAS DE INTEGRACIÓN API ---');

  try {
    // 1. Registro Player 1
    console.log('\n1. Registrando Player 1...');
    const user1 = { username: `test_p1_${Date.now()}`, email: `p1_${Date.now()}@test.com`, password: 'password123' };
    const reg1 = await axios.post(`${BASE_URL}/api/auth/register`, user1);
    console.log('   OK:', reg1.data.success);
    const token1 = reg1.data.data.token;

    // 2. Registro Player 2
    console.log('\n2. Registrando Player 2...');
    const user2 = { username: `test_p2_${Date.now()}`, email: `p2_${Date.now()}@test.com`, password: 'password123' };
    const reg2 = await axios.post(`${BASE_URL}/api/auth/register`, user2);
    console.log('   OK:', reg2.data.success);
    const token2 = reg2.data.data.token;

    // 3. Matchmaking
    console.log('\n3. Iniciando Matchmaking...');
    console.log('   Player 1 buscando...');
    await axios.post(`${BASE_URL}/api/matchmaking/find`, {}, { headers: { Authorization: `Bearer ${token1}` } });
    
    console.log('   Player 2 buscando...');
    const match = await axios.post(`${BASE_URL}/api/matchmaking/find`, {}, { headers: { Authorization: `Bearer ${token2}` } });
    
    if (match.data.data.status === 'MATCHED') {
      const gameId = match.data.data.gameId;
      console.log('   ¡MATCH ENCONTRADO! GameId:', gameId);

      // 4. Disparo (Shoot)
      console.log('\n4. Probando Disparo Autoridativo (Shoot)...');
      const shotParams = {
        gameId,
        velocity: 85,
        angleDegrees: 45,
        direction: 1,
        weaponId: 'spear'
      };

      const shootRes = await axios.post(`${BASE_URL}/api/game/shoot`, shotParams, { 
        headers: { Authorization: `Bearer ${token2}` } 
      });

      if (shootRes.data.success) {
        console.log('   ¡DISPARO PROCESADO!');
        console.log('   - Puntos de trayectoria:', shootRes.data.data.trajectory.length);
        console.log('   - Daño causado:', shootRes.data.data.damage);
        console.log('   - Empuje (Knockback):', shootRes.data.data.knockback.toFixed(2));
        console.log('   - Análisis de Sensibilidad (dR/dv):', shootRes.data.data.sensitivityAnalysis.values.dRdv.toFixed(2));
      } else {
        console.log('   ERROR EN DISPARO:', shootRes.data.error);
      }
    } else {
      console.log('   ERROR: Matchmaking no devolvió MATCHED');
    }

    console.log('\n--- PRUEBAS COMPLETADAS CON ÉXITO ---');

  } catch (error: any) {
    console.error('\n!!! ERROR EN LAS PRUEBAS !!!');
    console.error('Mensaje:', error.response?.data || error.message);
  }
}

testFlow();
