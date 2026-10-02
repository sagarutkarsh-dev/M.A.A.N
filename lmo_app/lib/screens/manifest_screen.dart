import 'package:flutter/material.dart';
import '../models/manifest_item.dart';
import '../services/offline_manifest_service.dart';
import '../services/api_service.dart';
import 'chassis_capture_screen.dart';

class ManifestScreen extends StatefulWidget {
  const ManifestScreen({super.key});

  @override
  State<ManifestScreen> createState() => _ManifestScreenState();
}

class _ManifestScreenState extends State<ManifestScreen> {
  final _manifestService = OfflineManifestService();
  List<ManifestItem> _items = [];
  bool _isLoading = true;
  String _selectedFilter = 'ALL'; // ALL, PENDING, COMPLETED

  @override
  void initState() {
    super.initState();
    _loadManifest();
  }

  Future<void> _loadManifest() async {
    setState(() => _isLoading = true);
    final list = await _manifestService.loadDailyManifest();
    setState(() {
      _items = list;
      _isLoading = false;
    });
  }

  Future<void> _syncQueuedInspections() async {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Connecting to M.A.A.N. server to sync offline ledger...')),
    );
    final api = ApiService();
    final count = await _manifestService.syncAllQueuedInspections(api);
    await _loadManifest();
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          backgroundColor: const Color(0xFF10B981),
          content: Text('Successfully synchronized $count inspection(s) with Central Ledger!'),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final filtered = _selectedFilter == 'ALL'
        ? _items
        : _items.where((i) => i.status == _selectedFilter).toList();

    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      appBar: AppBar(
        backgroundColor: const Color(0xFF0F172A),
        elevation: 0,
        title: const Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Daily Inspection Manifest',
              style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
            ),
            Text(
              'PostGIS Algorithmic Routing • Kozhikode South',
              style: TextStyle(color: Color(0xFF94A3B8), fontSize: 11),
            ),
          ],
        ),
        actions: [
          IconButton(
            onPressed: _syncQueuedInspections,
            icon: const Icon(Icons.sync, color: Color(0xFF10B981)),
            tooltip: 'Sync Offline Queue',
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : Column(
              children: [
                // Offline status banner
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  color: const Color(0xFF1E293B),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Row(
                        children: [
                          Icon(Icons.wifi_off, size: 14, color: Color(0xFFF59E0B)),
                          SizedBox(width: 6),
                          Text(
                            'Offline Manifest Mode Active (Hive Cache)',
                            style: TextStyle(color: Color(0xFFCBD5E1), fontSize: 11),
                          ),
                        ],
                      ),
                      Text(
                        '${_items.length} Assigned Units',
                        style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 11, fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                ),

                // Filter chips
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  child: Row(
                    children: [
                      _buildFilterChip('ALL', 'All (${_items.length})'),
                      const SizedBox(width: 8),
                      _buildFilterChip('PENDING', 'Pending (${_items.where((i) => i.status == "PENDING").length})'),
                      const SizedBox(width: 8),
                      _buildFilterChip('COMPLETED', 'Certified (${_items.where((i) => i.status == "COMPLETED" || i.status == "SYNCED").length})'),
                    ],
                  ),
                ),

                // Manifest List
                Expanded(
                  child: filtered.isEmpty
                      ? Center(
                          child: Text(
                            'No $_selectedFilter inspections in today\'s route',
                            style: const TextStyle(color: Color(0xFF64748B), fontSize: 13),
                          ),
                        )
                      : ListView.separated(
                          padding: const EdgeInsets.all(16),
                          itemCount: filtered.length,
                          separatorBuilder: (ctx, i) => const SizedBox(height: 12),
                          itemBuilder: (ctx, i) {
                            final item = filtered[i];
                            return _buildManifestCard(item);
                          },
                        ),
                ),
              ],
            ),
    );
  }

  Widget _buildFilterChip(String value, String label) {
    final isSelected = _selectedFilter == value;
    return GestureDetector(
      onTap: () => setState(() => _selectedFilter = value),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFF10B981) : const Color(0xFF1E293B),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: isSelected ? const Color(0xFF10B981) : const Color(0xFF334155)),
        ),
        child: Text(
          label,
          style: TextStyle(
            color: isSelected ? Colors.white : const Color(0xFF94A3B8),
            fontSize: 11,
            fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
          ),
        ),
      ),
    );
  }

  Widget _buildManifestCard(ManifestItem item) {
    final isCompleted = item.status == 'COMPLETED' || item.status == 'SYNCED';

    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: isCompleted ? const Color(0xFF065F46) : const Color(0xFF334155)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(
                  item.shopName,
                  style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14),
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: isCompleted
                      ? const Color(0xFF065F46)
                      : (item.status == 'PENDING' ? const Color(0xFF78350F) : const Color(0xFF1E3A8A)),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(
                  isCompleted ? (item.status == 'SYNCED' ? 'SYNCED' : 'CERTIFIED') : 'PENDING',
                  style: TextStyle(
                    color: isCompleted
                        ? const Color(0xFFA7F3D0)
                        : (item.status == 'PENDING' ? const Color(0xFFFDE68A) : const Color(0xFFBFDBFE)),
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 4),
          Text(
            '${item.address} (PIN: ${item.pinCode})',
            style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 11),
          ),
          const SizedBox(height: 10),

          // Instrument specs row
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: const Color(0xFF0F172A),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(item.instrumentCategory, style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold)),
                    Text('SN: ${item.serialNo} • Quarter: ${item.stampingQuarterCode}', style: const TextStyle(color: Color(0xFF64748B), fontSize: 9, fontFamily: 'monospace')),
                  ],
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text('Class ${item.accuracyClass}', style: const TextStyle(color: Color(0xFF38BDF8), fontSize: 11, fontWeight: FontWeight.bold)),
                    Text('Cap: ${item.capacityKg} kg (e=${item.scaleIntervalEGrams}g)', style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 9)),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),

          // Action Button
          SizedBox(
            width: double.infinity,
            height: 38,
            child: ElevatedButton.icon(
              onPressed: () async {
                await Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => ChassisCaptureScreen(manifestItem: item)),
                );
                _loadManifest();
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: isCompleted ? const Color(0xFF334155) : const Color(0xFF10B981),
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
              ),
              icon: Icon(isCompleted ? Icons.check : Icons.camera_alt, size: 16),
              label: Text(
                isCompleted ? 'Re-Inspect Instrument' : 'Start In-Situ Inspection',
                style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
