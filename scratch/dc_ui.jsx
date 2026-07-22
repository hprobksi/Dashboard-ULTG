{activeMenu === 'dc' && (
              <section className="stack dc-monitor-stack">
                {/* 1. Compact Status Ribbon */}
                <div className="status-ribbon dc-status-ribbon" style={{ display: 'flex', gap: '24px', padding: '8px 16px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: '11px', color: '#64748b' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Activity size={14} color="#3b82f6" />
                    <span>Status: <strong>{dcStatus.is_scanning ? 'Memindai' : 'Siap'}</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock3 size={14} />
                    <span>Update: <strong>{dcStatus.last_scan_time || '-'}</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Server size={14} />
                    <span>Total GI: <strong>{dcCards.length}</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Check size={14} color="#10b981" />
                    <span>Online: <strong>{activeDcCount}</strong></span>
                  </div>
                </div>

                {error && (
                  <div className="status-banner danger" style={{ margin: '12px 16px' }}>
                    <AlertTriangle size={14} />
                    <span>{error}</span>
                  </div>
                )}

                {/* 2. Unified Action & Filter Bar */}
                <div className="action-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid #f1f5f9' }}>
                  <div className="filter-row dc-filter-row" style={{ margin: 0 }}>
                    {['Semua', 'Alarm', 'Online', 'Offline'].map((item) => (
                      <button
                        key={item}
                        className={`filter-chip ${filterType === item ? 'active' : ''}`}
                        onClick={() => setFilterType(item)}
                      >
                        {item}
                      </button>
                    ))}
                    <span className="dc-filter-count" style={{ marginLeft: '12px', fontSize: '11px' }}>
                      {filteredDcCards.length} / {dcCards.length} GI
                    </span>
                  </div>

                  <div className="dc-actions" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div className="toggle-box dc-polling-toggle" style={{ transform: 'scale(0.85)', margin: 0 }}>
                      <span style={{ fontSize: '11px' }}>{dcStatus.auto_polling_active ? 'Auto-Polling Aktif' : 'Auto-Polling Mati'}</span>
                      <label className="switch">
                        <input type="checkbox" checked={dcStatus.auto_polling_active} onChange={togglePolling} />
                        <span className="switch-slider" />
                      </label>
                    </div>
                    <button className="btn amber dc-log-button" onClick={openDcAlarmModal} style={{ padding: '4px 10px', fontSize: '11px' }}>
                      <Bell size={14} />
                      <span>Log Alarm</span>
                    </button>
                    <button className="btn blue dc-refresh-button" onClick={forceRefresh} disabled={loading || dcStatus.is_scanning} style={{ padding: '4px 10px', fontSize: '11px' }}>
                      <RefreshCw size={14} className={loading || dcStatus.is_scanning ? 'spin' : ''} />
                      <span>{loading || dcStatus.is_scanning ? 'Memindai...' : 'Refresh'}</span>
                    </button>
                  </div>
                </div>

                <div className="device-grid" style={{ padding: '16px' }}>
                  {filteredDcCards.length > 0 ? (
                    filteredDcCards.map((gi) => (
                      <article
                        className={`device-card ${gi.alarm_level === 'warning' ? 'alarm-warning' : ''} ${
                          gi.alarm_level === 'critical' ? 'alarm-critical' : ''
                        }`}
                        key={gi.nama}
                      >
                        <div className="device-head">
                          <div>
                            <div className="device-name">
                              <Server size={17} />
                              <span>{gi.nama}</span>
                            </div>
                            <div className="device-sub">{gi.ip}</div>
                          </div>
                          <div className="device-tools">
                            <span className={`status-badge status-${(gi.status || 'offline').toLowerCase()}`}>
                              {gi.status || 'offline'}
                            </span>
                            <button
                              type="button"
                              className="icon-btn danger"
                              aria-label={`Hapus GI ${gi.nama}`}
                              onClick={() => handleDeleteGi(gi.nama)}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>

                        <div className="device-values">
                          <div className="metric-box primary">
                            <span>Tegangan (V_PN)</span>
                            <strong>
                              <span className="metric-value">{gi.status === 'online' ? formatNumber(gi.v_pn) : '--'}</span>
                              <span className="metric-unit">V</span>
                            </strong>
                          </div>
                          <div className="metric-box">
                            <span>Arus</span>
                            <strong>
                              <span className="metric-value">{gi.status === 'online' ? formatNumber(gi.arus) : '--'}</span>
                              <span className="metric-unit">A</span>
                            </strong>
                          </div>
                          <div className="metric-box">
                            <span>V_PG</span>
                            <strong>
                              <span className="metric-value">{gi.status === 'online' ? formatNumber(gi.v_pg) : '--'}</span>
                              <span className="metric-unit">V</span>
                            </strong>
                          </div>
                          <div className="metric-box">
                            <span>V_NG</span>
                            <strong>
                              <span className="metric-value">{gi.status === 'online' ? formatNumber(gi.v_ng) : '--'}</span>
                              <span className="metric-unit">V</span>
                            </strong>
                          </div>
                        </div>

                        <p className="dc-status-text">{gi.status_message || 'Belum ada data polling DC.'}</p>

                        <div className="device-footer">
                          <button className="ghost-link" onClick={() => fetchTrendData(gi.nama)}>
                            <LineChartIcon size={16} />
                            <span>Trend</span>
                          </button>
                        </div>
                      </article>
                    ))
                  ) : (
                    <div className="empty-panel">
                      <Gauge size={42} />
                      <h3>{dcCards.length > 0 ? `Tidak ada data ${filterType}` : 'Belum ada data'}</h3>
                      <p>{dcCards.length > 0 ? 'Ubah filter ke Semua untuk menampilkan seluruh GI.' : 'Tambahkan peralatan lalu tekan refresh untuk memulai pemantauan.'}</p>
                    </div>
                  )}
                </div>
              </section>
            )}