import 'package:flutter/material.dart';
import 'manifest_screen.dart';
import 'chassis_capture_screen.dart';
import 'legacy_certificate_screen.dart';
import 'mpe_field_tool_screen.dart';
import '../services/offline_manifest_service.dart';
import '../services/api_service.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  final String officerId = "LMO-KL-442";
  final String jurisdiction = "Kozhikode South, Kerala";
  final _manifestService = OfflineManifestService();

  int offlineQueueCount = 0;
  int completedCount = 0;
  int pendingCount = 0;
  bool _isSyncing = false;

  @override
  void initState() {
    super.initState();
    _refreshStats();
  }

  Future<void> _refreshStats() async {
    final manifest = await _manifestService.loadDailyManifest();
    final queued = await _manifestService.getOfflineInspections();

    int comp = 0;
    int pend = 0;
    for (final item in manifest) {
      if (item.status == 'COMPLETED' || item.status == 'SYNCED') {
        comp++;
      } else {
        pend++;
      }
    }

    if (mounted) {
      setState(() {
        offlineQueueCount = queued.length;
        completedCount = comp;
        pendingCount = pend;
      });
    }
  }

  Future<void> _handleSyncNow() async {
    setState(() => _isSyncing = true);
    final api = ApiService();
    try {
      final synced = await _manifestService.syncAllQueuedInspections(api);
      await _refreshStats();
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            backgroundColor: const Color(0xFF10B981),
            content: Text('Successfully synced $synced inspection(s) with Central Ledger!'),
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            backgroundColor: const Color(0xFFEF4444),
            content: Text('Sync failed: $e (Kept safe in offline cache)'),
          ),
        );
      }
    } finally {
      if (mounted) setState(() => _isSyncing = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F172A), // Slate 900
      appBar: AppBar(
        backgroundColor: const Color(0xFF0F172A),
        elevation: 0,
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'M.A.A.N. Inspector',
              style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 18),
            ),
            Text(
              'Legal Metrology Field Client • $jurisdiction',
              style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 11),
            ),
          ],
        ),
        actions: [
          Container(
            margin: const EdgeInsets.only(right: 16),
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: const Color(0xFF1E293B),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: const Color(0xFF334155)),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.badge, size: 14, color: Color(0xFF10B981)),
                const SizedBox(width: 4),
                Text(
                  officerId,
                  style: const TextStyle(color: Colors.white, fontSize: 12, fontFamily: 'monospace'),
                ),
              ],
            ),
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _refreshStats,
        color: const Color(0xFF10B981),
        backgroundColor: const Color(0xFF1E293B),
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Status & Sync Banner
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF065F46), Color(0xFF047857)],
                  ),
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFF047857).withOpacity(0.3),
                      blurRadius: 10,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Row(
                  children: [
                    const Icon(Icons.cloud_sync, color: Colors.white, size: 36),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Offline-First Local Cache',
                            style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15),
                          ),
                          Text(
                            offlineQueueCount == 0
                                ? 'All field inspections synced to Central Ledger'
                                : '$offlineQueueCount inspection(s) queued offline',
                            style: const TextStyle(color: Color(0xFFA7F3D0), fontSize: 12),
                          ),
                        ],
                      ),
                    ),
                    ElevatedButton(
                      onPressed: _isSyncing ? null : _handleSyncNow,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.white,
                        foregroundColor: const Color(0xFF065F46),
                        elevation: 0,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                      ),
                      child: _isSyncing
                          ? const SizedBox(width: 14, height: 14, child: CircularProgressIndicator(strokeWidth: 2))
                          : const Text('Sync Now', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // Metrics Grid
              const Text(
                "TODAY'S POSTGIS DISPATCH",
                style: TextStyle(
                  color: Color(0xFF94A3B8),
                  fontSize: 11,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1.2,
                ),
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  _buildMetricCard('Certified', '$completedCount', Icons.check_circle_outline, const Color(0xFF10B981)),
                  const SizedBox(width: 12),
                  _buildMetricCard('Pending', '$pendingCount', Icons.pending_actions, const Color(0xFFF59E0B)),
                  const SizedBox(width: 12),
                  _buildMetricCard('Queued', '$offlineQueueCount', Icons.cloud_off, const Color(0xFF38BDF8)),
                ],
              ),
              const SizedBox(height: 28),

              // Core Action Modules
              const Text(
                "FIELD OPERATIONS & EVIDENCE",
                style: TextStyle(
                  color: Color(0xFF94A3B8),
                  fontSize: 11,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1.2,
                ),
              ),
              const SizedBox(height: 12),

              // Card 1: Daily Inspection Manifest
              _buildActionCard(
                context,
                title: 'Daily Inspection Manifest',
                subtitle: 'Offline Hive cache of assigned shops & spatial routes',
                icon: Icons.route,
                color: const Color(0xFF10B981),
                badgeText: '$pendingCount Due',
                onTap: () async {
                  await Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => const ManifestScreen()),
                  );
                  _refreshStats();
                },
              ),
              const SizedBox(height: 12),

              // Card 2: Chassis & 3-Layer Binding
              _buildActionCard(
                context,
                title: 'Chassis OCR & 3-Layer Binding',
                subtitle: 'Native Camera OCR, wire seal geotag & EEPROM counter',
                icon: Icons.camera_alt,
                color: const Color(0xFF3B82F6),
                badgeText: 'ML Kit Active',
                onTap: () async {
                  await Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => const ChassisCaptureScreen()),
                  );
                  _refreshStats();
                },
              ),
              const SizedBox(height: 12),

              // Card 3: Seventh Schedule MPE Calculator
              _buildActionCard(
                context,
                title: 'Seventh Schedule MPE Calculator',
                subtitle: 'On-device Table 20 continuous rounding & Pass/Fail verdict',
                icon: Icons.calculate,
                color: const Color(0xFFF59E0B),
                badgeText: 'Offline Ready',
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => const MPEFieldToolScreen()),
                  );
                },
              ),
              const SizedBox(height: 12),

              // Card 4: Legacy Certificate Scan (Day-Forward Migration)
              _buildActionCard(
                context,
                title: 'Upload Legacy Paper Certificate',
                subtitle: 'Zero-downtime Day-Forward migration of active certificates',
                icon: Icons.document_scanner,
                color: const Color(0xFFA855F7),
                badgeText: 'Day-Forward',
                onTap: () async {
                  await Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => const LegacyCertificateScreen()),
                  );
                  _refreshStats();
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildMetricCard(String label, String value, IconData icon, Color color) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: const Color(0xFF1E293B),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: const Color(0xFF334155)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon, size: 20, color: color),
            const SizedBox(height: 8),
            Text(
              value,
              style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 20),
            ),
            Text(label, style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 11)),
          ],
        ),
      ),
    );
  }

  Widget _buildActionCard(
    BuildContext context, {
    required String title,
    required String subtitle,
    required IconData icon,
    required Color color,
    required String badgeText,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: const Color(0xFF1E293B),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: const Color(0xFF334155)),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: color.withOpacity(0.15),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, color: color, size: 24),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Text(
                        title,
                        style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14),
                      ),
                      const SizedBox(width: 6),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1.5),
                        decoration: BoxDecoration(
                          color: color.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(
                          badgeText,
                          style: TextStyle(color: color, fontSize: 9, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(
                    subtitle,
                    style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 11),
                  ),
                ],
              ),
            ),
            const Icon(Icons.arrow_forward_ios, color: Color(0xFF64748B), size: 14),
          ],
        ),
      ),
    );
  }
}
