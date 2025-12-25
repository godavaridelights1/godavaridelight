#!/usr/bin/env node

/**
 * Script to check and display payment configuration status
 * Run: node scripts/check-payment-config.js
 */

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function checkPaymentConfig() {
  try {
    console.log('\n🔍 Checking Payment Configuration...\n')

    const config = await prisma.paymentConfig.findFirst()

    if (!config) {
      console.log('❌ No payment configuration found in database')
      console.log('\n📝 Creating default configuration...')
      
      const newConfig = await prisma.paymentConfig.create({
        data: {
          razorpayKeyId: '',
          razorpayKeySecret: '',
          isTestMode: true
        }
      })
      
      console.log('✅ Default configuration created')
      console.log('\nConfiguration:')
      console.log('  - Razorpay Key ID: (empty)')
      console.log('  - Razorpay Key Secret: (empty)')
      console.log('  - Mode: Test')
      console.log('\n⚠️  Please configure Razorpay keys in Admin Settings')
    } else {
      console.log('✅ Payment configuration found\n')
      console.log('Configuration:')
      console.log(`  - Razorpay Key ID: ${config.razorpayKeyId ? (config.razorpayKeyId.substring(0, 12) + '...') : '(empty)'}`)
      console.log(`  - Razorpay Key Secret: ${config.razorpayKeySecret ? '••••••••••••••••' : '(empty)'}`)
      console.log(`  - Mode: ${config.isTestMode ? 'Test' : 'Live'}`)
      
      if (!config.razorpayKeyId || !config.razorpayKeySecret) {
        console.log('\n⚠️  Keys are not configured!')
        console.log('\n📋 To fix this:')
        console.log('  1. Get Razorpay test keys from: https://dashboard.razorpay.com/app/website-app-settings/api-keys')
        console.log('  2. Go to: http://localhost:3000/admin/settings')
        console.log('  3. Enter your Razorpay Key ID and Secret')
        console.log('  4. Save configuration')
      } else if (config.razorpayKeyId.trim() === '' || config.razorpayKeySecret.trim() === '') {
        console.log('\n⚠️  Keys are empty strings!')
        console.log('     Please update them in Admin Settings')
      } else {
        const keyPrefix = config.razorpayKeyId.substring(0, 8)
        if (config.isTestMode && !keyPrefix.includes('test')) {
          console.log('\n⚠️  Warning: Test mode is enabled but key doesn\'t look like a test key')
          console.log('     Test keys should start with: rzp_test_')
        } else if (!config.isTestMode && !keyPrefix.includes('live')) {
          console.log('\n⚠️  Warning: Live mode is enabled but key doesn\'t look like a live key')
          console.log('     Live keys should start with: rzp_live_')
        } else {
          console.log('\n✅ Configuration looks good!')
        }
      }
    }

    // Check environment variables
    console.log('\n🔍 Environment Variables:')
    console.log(`  - RAZORPAY_KEY_ID: ${process.env.RAZORPAY_KEY_ID ? (process.env.RAZORPAY_KEY_ID.substring(0, 12) + '...') : '(not set)'}`)
    console.log(`  - RAZORPAY_KEY_SECRET: ${process.env.RAZORPAY_KEY_SECRET ? '••••••••••••••••' : '(not set)'}`)
    
    console.log('\n')
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

checkPaymentConfig()
