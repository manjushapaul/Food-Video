#!/usr/bin/env node
/**
 * Test script to verify Strapi Hero API is returning data.
 * Run: node scripts/test-hero-api.js
 * Requires: Strapi running at http://localhost:1337
 */
const STRAPI_URL = 'http://localhost:1337';

async function test() {
  console.log('Testing Strapi Hero API...\n');
  try {
    const url = `${STRAPI_URL}/api/hero?populate[Image]=true&status=published`;
    console.log('GET', url, '\n');
    const res = await fetch(url);
    const data = await res.json();
    console.log('Status:', res.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    if (res.ok && data?.data) {
      console.log('\n✓ Hero data found');
      const d = data.data;
      console.log('  Title:', d.Title ?? '(empty)');
      console.log('  Subtitle:', d.Subtitle ?? '(empty)');
      console.log('  Image:', d.Image?.url ?? '(none)');
      console.log('  cta:', d.cta ?? '(empty)');
      console.log('  ctalink:', d.ctalink ?? '(empty)');
    } else if (!res.ok) {
      console.log('\n✗ API error. Check:');
      console.log('  1. Strapi is running (npm run develop in cms/)');
      console.log('  2. Hero find permission is enabled: Settings → Users & Permissions → Roles → Public → Hero → find');
    } else {
      console.log('\n✗ No hero data (data is null/undefined)');
      console.log('  Create and publish Hero content in Content Manager');
    }
  } catch (err) {
    console.error('Error:', err.message);
    console.log('\nIs Strapi running? Start with: cd cms && npm run develop');
  }
}

test();
