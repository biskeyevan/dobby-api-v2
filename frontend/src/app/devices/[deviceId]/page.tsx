'use client';

import { useEffect, useState } from 'react';
import { deviceAPI } from '@/services/api';
import { Device } from '@/types';
import { FiAlertCircle, FiArrowLeft, FiBattery, FiCpu, FiWifi } from 'react-icons/fi';
import Link from 'next/link';

// Helper function to get link type name
const getLinkTypeName = (linkType?: number): string => {
    if (linkType === 1) return 'BLE';
    if (linkType === 4) return 'LoRA';
    return 'Unknown';
};

// Helper function to format date
const formatDate = (dateString?: string): string => {
    if (!dateString) return 'Unknown';
    try {
        return new Date(dateString).toLocaleString();
    } catch (e) {
        return dateString;
    }
};

// Helper function to check if a date is within 1 day of now
const isWithinOneDay = (dateString?: string): boolean => {
    if (!dateString) return false;
    try {
        const date = new Date(dateString);
        const now = new Date();
        const oneDayMs = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        return (now.getTime() - date.getTime()) < oneDayMs;
    } catch (e) {
        return false;
    }
};

export default function DeviceDetailsPage({ params }: { params: { deviceId: string } }) {
    const { deviceId } = params;
    const [device, setDevice] = useState<Device | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDeviceDetails = async () => {
            try {
                setIsLoading(true);
                const data = await deviceAPI.getDeviceById(deviceId);
                console.log("Device details:", data);
                setDevice(data);
            } catch (err) {
                console.error('Error fetching device details:', err);
                setError('Failed to fetch device details. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchDeviceDetails();
    }, [deviceId]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error || !device) {
        return (
            <div className="bg-red-50 border-l-4 border-red-600 p-4 mb-4">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <FiAlertCircle className="h-5 w-5 text-red-600" />
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-red-800">{error || 'Device not found'}</p>
                    </div>
                </div>
            </div>
        );
    }

    // Change health status logic - now based on updated_at time
    const isHealthy = device.updated_at ? isWithinOneDay(device.updated_at) : false;

    return (
        <div>
            <div className="mb-6">
                <Link href="/devices" className="inline-flex items-center text-blue-600 hover:text-blue-800">
                    <FiArrowLeft className="mr-2" />
                    Back to Devices
                </Link>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Device Information</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">Details and specifications.</p>
                    </div>
                    <div>
                        <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${isHealthy ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                            {isHealthy ? 'Healthy' : 'Needs Attention'}
                        </span>
                    </div>
                </div>
                <div className="border-t border-gray-200">
                    <dl>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Device ID</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{device.device_id}</dd>
                        </div>
                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Device Type</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{device.device_type}</dd>
                        </div>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Model Number</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{device.model_number}</dd>
                        </div>
                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Serial Number</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{device.serial_number}</dd>
                        </div>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Firmware Version</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{device.firmware_version}</dd>
                        </div>
                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Firmware Date</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{device.firmware_date}</dd>
                        </div>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">CTA Version</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{device.cta_version}</dd>
                        </div>
                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Vendor ID</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{device.vendor_id}</dd>
                        </div>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Device Revision</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{device.device_revision}</dd>
                        </div>
                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Capability Bitmap</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{device.capability_bitmap}</dd>
                        </div>
                        {device.gridcube_firmware_version && (
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">GridCube Firmware Version</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{device.gridcube_firmware_version}</dd>
                            </div>
                        )}
                        {device.last_rx_rssi !== undefined && (
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500 flex items-center">
                                    <FiWifi className="mr-2" /> Signal Strength (RSSI)
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {device.last_rx_rssi} dBm
                                </dd>
                            </div>
                        )}
                        {device.last_link_type !== undefined && (
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500 flex items-center">
                                    <FiCpu className="mr-2" /> Link Type
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {getLinkTypeName(device.last_link_type)}
                                </dd>
                            </div>
                        )}
                        {device.updated_at && (
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {formatDate(device.updated_at)}
                                </dd>
                            </div>
                        )}
                    </dl>
                </div>
            </div>

            {/* Action buttons section */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Device Actions</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">Control and manage this device.</p>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                        <button
                            type="button"
                            className="inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <FiBattery className="mr-2 h-5 w-5" />
                            Check Status
                        </button>
                        <button
                            type="button"
                            className="inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            <FiCpu className="mr-2 h-5 w-5" />
                            Update Firmware
                        </button>
                        <button
                            type="button"
                            className="inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            <FiAlertCircle className="mr-2 h-5 w-5" />
                            Reset Device
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 