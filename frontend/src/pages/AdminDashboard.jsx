import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAdmin } from "../context/AdminContext";

const API = import.meta.env.VITE_API_URL || "/api";
const GENRES = ["Action","Drama","Sci-Fi","Comedy","Horror","Thriller","Romance","Animation"];
const TIMES  = ["7:00 AM","10:00 AM","1:00 PM","3:00 PM","6:00 PM","9:00 PM"];

const EMPTY = {
  title:"", description:"", genre:"", duration:"",
  releaseDate:"", price:"", availableSeats:"", rating:"",
  showTimes:[], showDates:[], poster:"",
};

export default function AdminDashboard() {
  const { admin, adminLogout } = useAdmin();
  const navigate = useNavigate();
  const [tab, setTab] = useState("movies");
  const [movies, setMovies] = useState([]);
  const [moviesLoading, setMoviesLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editMovie, setEditMovie] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [posterFile, setPosterFile] = useState(null);
  const [posterPreview, setPosterPreview] = useState("");
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast, setToast] = useState("");
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [todayOnly, setTodayOnly] = useState(false);
  const [newDate, setNewDate] = useState("");

  const headers = { "x-admin-token": admin?.token };

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  useEffect(() => { if (!admin) navigate("/admin"); }, [admin, navigate]);

  const fetchMovies = useCallback(async () => {
    setMoviesLoading(true);
    try { const r = await axios.get(`${API}/admin/movies`, { headers }); setMovies(r.data); }
    catch { /* ignore */ } finally { setMoviesLoading(false); }
  }, [admin]);

  const fetchBookings = useCallback(async () => {
    setBookingsLoading(true);
    try {
      const url = todayOnly ? `${API}/admin/bookings?today=true` : `${API}/admin/bookings`;
      const r = await axios.get(url, { headers });
      setBookings(r.data);
    } catch { /* ignore */ } finally { setBookingsLoading(false); }
  }, [admin, todayOnly]);

  useEffect(() => { fetchMovies(); }, [fetchMovies]);
  useEffect(() => { if (tab === "bookings") fetchBookings(); }, [tab, fetchBookings]);

  const openCreate = () => { setEditMovie(null); setForm(EMPTY); setPosterFile(null); setPosterPreview(""); setFormError(""); setShowForm(true); };
  const openEdit = (m) => {
    setEditMovie(m);
    setForm({ title:m.title, description:m.description, genre:m.genre, duration:m.duration,
      releaseDate:m.releaseDate?.split("T")[0]||"", price:m.price, availableSeats:m.availableSeats,
      rating:m.rating||"", showTimes:m.showTimes||[], showDates:m.showDates||[], poster:m.poster||"" });
    setPosterFile(null); setPosterPreview(m.poster||""); setFormError(""); setShowForm(true);
  };

  const handlePosterChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPosterFile(file);
    setPosterPreview(URL.createObjectURL(file));
  };

  const toggleTime = (t) => setForm(f => ({
    ...f, showTimes: f.showTimes.includes(t) ? f.showTimes.filter(x=>x!==t) : [...f.showTimes, t]
  }));

  const addDate = () => {
    if (!newDate || form.showDates.includes(newDate)) return;
    setForm(f => ({ ...f, showDates: [...f.showDates, newDate].sort() }));
    setNewDate("");
  };
  const removeDate = (d) => setForm(f => ({ ...f, showDates: f.showDates.filter(x=>x!==d) }));

  const handleFormSubmit = async (e) => {
    e.preventDefault(); setFormError(""); setFormLoading(true);
    try {
      let posterUrl = form.poster;
      if (posterFile) {
        const fd = new FormData(); fd.append("poster", posterFile);
        const up = await axios.post(`${API}/admin/upload`, fd, { headers: { ...headers, "Content-Type":"multipart/form-data" } });
        posterUrl = up.data.url;
      }
      const payload = { ...form, poster: posterUrl,
        showTimes: JSON.stringify(form.showTimes), showDates: JSON.stringify(form.showDates) };
      if (editMovie) {
        await axios.put(`${API}/admin/movies/${editMovie._id}`, payload, { headers });
        showToast("Movie updated!");
      } else {
        await axios.post(`${API}/admin/movies`, payload, { headers });
        showToast("Movie added!");
      }
      setShowForm(false); fetchMovies();
    } catch (err) { setFormError(err.response?.data?.message || "Error saving movie."); }
    finally { setFormLoading(false); }
  };

  const handleDelete = async (id) => {
    try { await axios.delete(`${API}/admin/movies/${id}`, { headers }); setDeleteConfirm(null); showToast("Movie deleted."); fetchMovies(); }
    catch { showToast("Delete failed."); }
  };

  const handleDeleteBooking = async (id) => {
    try { await axios.delete(`${API}/admin/bookings/${id}`, { headers }); showToast("Booking removed."); fetchBookings(); }
    catch { showToast("Delete failed."); }
  };

  if (!admin) return null;

  return (
    <div style={s.page}>
      {toast && <div style={s.toast}>{toast}</div>}

      <aside style={s.sidebar}>
        <div style={s.brand}>🎬 CineBook</div>
        <div style={s.badge}>🔐 Admin</div>
        <p style={s.adminName}>👤 {admin.name}</p>
        <nav style={s.nav}>
          {["movies","bookings"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ ...s.navBtn, ...(tab===t ? s.navActive : {}) }}>
              {t === "movies" ? "🎥 Movies" : "🎟️ Bookings"}
            </button>
          ))}
        </nav>
        <button onClick={() => { adminLogout(); navigate("/admin"); }} style={s.logoutBtn}>⬅️ Logout</button>
      </aside>

      <main style={s.main}>

        {tab === "movies" && (
          <div>
            <div style={s.topBar}>
              <div><h2 style={s.title}>Movies</h2><p style={s.sub}>{movies.length} total</p></div>
              <button onClick={openCreate} style={s.addBtn}>+ Add Movie</button>
            </div>
            {moviesLoading ? <div style={s.center}><span style={s.spinner}/></div> : (
              <div style={s.table}>
                <div style={s.thead}>
                  <span style={{flex:2}}>Movie</span><span style={{flex:1}}>Genre</span>
                  <span style={{flex:1}}>Price</span><span style={{flex:1}}>Seats</span>
                  <span style={{flex:1}}>Times</span><span style={{flex:1,textAlign:"right"}}>Actions</span>
                </div>
                {movies.length === 0 && <p style={s.empty}>No movies yet.</p>}
                {movies.map(m => (
                  <div key={m._id} style={s.trow}>
                    <div style={{flex:2,display:"flex",alignItems:"center",gap:8}}>
                      <img src={m.poster||"https://via.placeholder.com/36x50"} alt={m.title}
                        style={{width:36,height:50,objectFit:"cover",borderRadius:4,flexShrink:0}}/>
                      <span style={{fontWeight:600,fontSize:"0.88rem"}}>{m.title}</span>
                    </div>
                    <span style={{flex:1,color:"#aaa",fontSize:"0.82rem"}}>{m.genre}</span>
                    <span style={{flex:1,color:"#e94560",fontWeight:700}}>${m.price}</span>
                    <span style={{flex:1,color:m.availableSeats>0?"#4caf50":"#e94560",fontSize:"0.82rem"}}>{m.availableSeats}</span>
                    <span style={{flex:1,color:"#888",fontSize:"0.75rem"}}>{(m.showTimes||[]).length} slots</span>
                    <div style={{flex:1,display:"flex",gap:6,justifyContent:"flex-end"}}>
                      <button onClick={() => openEdit(m)} style={s.editBtn}>✏️</button>
                      <button onClick={() => setDeleteConfirm(m)} style={s.delBtn}>🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "bookings" && (
          <div>
            <div style={s.topBar}>
              <div><h2 style={s.title}>Bookings</h2><p style={s.sub}>{bookings.length} shown</p></div>
              <div style={{display:"flex",gap:"0.6rem",alignItems:"center"}}>
                <label style={{display:"flex",alignItems:"center",gap:6,color:"#aaa",fontSize:"0.85rem",cursor:"pointer"}}>
                  <input type="checkbox" checked={todayOnly} onChange={e=>{setTodayOnly(e.target.checked);}}
                    style={{accentColor:"#7c3aed"}}/>
                  Today only
                </label>
                <button onClick={fetchBookings} style={s.refreshBtn}>↻ Refresh</button>
              </div>
            </div>
            {bookingsLoading ? <div style={s.center}><span style={s.spinner}/></div> : (
              <div style={s.table}>
                <div style={s.thead}>
                  <span style={{flex:2}}>Customer</span><span style={{flex:2}}>Movie</span>
                  <span style={{flex:1}}>Seats</span><span style={{flex:1}}>Total</span>
                  <span style={{flex:1}}>Date</span><span style={{flex:1}}>Time</span>
                  <span style={{flex:1}}>Status</span><span style={{flex:1,textAlign:"right"}}>Del</span>
                </div>
                {bookings.length === 0 && <p style={s.empty}>No bookings found.</p>}
                {bookings.map(b => (
                  <div key={b._id} style={s.trow}>
                    <div style={{flex:2}}>
                      <p style={{fontWeight:600,fontSize:"0.85rem"}}>{b.name}</p>
                      <p style={{color:"#555",fontSize:"0.75rem"}}>{b.email}</p>
                    </div>
                    <span style={{flex:2,color:"#ccc",fontSize:"0.82rem"}}>{b.movie?.title||"—"}</span>
                    <span style={{flex:1,color:"#aaa",fontSize:"0.82rem"}}>{b.seats}</span>
                    <span style={{flex:1,color:"#e94560",fontWeight:700}}>${b.totalPrice}</span>
                    <span style={{flex:1,color:"#888",fontSize:"0.78rem"}}>{b.showDate}</span>
                    <span style={{flex:1,color:"#888",fontSize:"0.78rem"}}>{b.showTime}</span>
                    <span style={{flex:1}}>
                      <span style={{
                        padding:"0.15rem 0.5rem",borderRadius:20,fontSize:"0.7rem",fontWeight:700,
                        background:b.status==="cancelled"?"rgba(233,69,96,0.15)":"rgba(76,175,80,0.15)",
                        color:b.status==="cancelled"?"#e94560":"#4caf50",
                        border:`1px solid ${b.status==="cancelled"?"#e94560":"#4caf50"}`,
                      }}>{b.status}</span>
                    </span>
                    <div style={{flex:1,display:"flex",justifyContent:"flex-end"}}>
                      <button onClick={() => handleDeleteBooking(b._id)} style={s.delBtn}>🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {showForm && (
        <div style={s.overlay} onClick={() => setShowForm(false)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <div style={s.mhead}>
              <h3 style={{color:"#fff",fontWeight:700}}>{editMovie ? "✏️ Edit Movie" : "➕ Add Movie"}</h3>
              <button onClick={() => setShowForm(false)} style={s.closeBtn}>✕</button>
            </div>
            {formError && <div style={s.ferr}>⚠️ {formError}</div>}
            <form onSubmit={handleFormSubmit} style={{display:"flex",flexDirection:"column",gap:"0.85rem"}}>

              <div style={s.frow}>
                <div style={s.ff}>
                  <label style={s.fl}>Title *</label>
                  <input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required style={s.fi} placeholder="Movie title"/>
                </div>
                <div style={s.ff}>
                  <label style={s.fl}>Genre *</label>
                  <select value={form.genre} onChange={e=>setForm({...form,genre:e.target.value})} required style={s.fi}>
                    <option value="">Select</option>
                    {GENRES.map(g=><option key={g}>{g}</option>)}
                  </select>
                </div>
              </div>

              <div style={s.ff}>
                <label style={s.fl}>Description *</label>
                <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})}
                  required rows={3} style={{...s.fi,resize:"vertical"}} placeholder="Movie description..."/>
              </div>

              <div style={s.frow}>
                <div style={s.ff}>
                  <label style={s.fl}>Duration (min) *</label>
                  <input type="number" value={form.duration} onChange={e=>setForm({...form,duration:e.target.value})} required min="1" style={s.fi} placeholder="120"/>
                </div>
                <div style={s.ff}>
                  <label style={s.fl}>Release Date *</label>
                  <input type="date" value={form.releaseDate} onChange={e=>setForm({...form,releaseDate:e.target.value})} required style={s.fi}/>
                </div>
              </div>

              <div style={s.frow}>
                <div style={s.ff}>
                  <label style={s.fl}>Price ($) *</label>
                  <input type="number" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} required min="1" style={s.fi} placeholder="14"/>
                </div>
                <div style={s.ff}>
                  <label style={s.fl}>Seats *</label>
                  <input type="number" value={form.availableSeats} onChange={e=>setForm({...form,availableSeats:e.target.value})} required min="0" style={s.fi} placeholder="100"/>
                </div>
                <div style={s.ff}>
                  <label style={s.fl}>Rating (0-10)</label>
                  <input type="number" value={form.rating} onChange={e=>setForm({...form,rating:e.target.value})} min="0" max="10" step="0.1" style={s.fi} placeholder="8.5"/>
                </div>
              </div>

              <div style={s.ff}>
                <label style={s.fl}>🕐 Show Times</label>
                <div style={{display:"flex",flexWrap:"wrap",gap:"0.4rem",marginTop:"0.3rem"}}>
                  {TIMES.map(t => (
                    <button type="button" key={t} onClick={() => toggleTime(t)} style={{
                      padding:"0.3rem 0.7rem",borderRadius:20,fontSize:"0.78rem",fontWeight:600,cursor:"pointer",border:"1px solid",
                      background:form.showTimes.includes(t)?"#7c3aed":"transparent",
                      color:form.showTimes.includes(t)?"#fff":"#888",
                      borderColor:form.showTimes.includes(t)?"#7c3aed":"#2a2a40",
                    }}>{t}</button>
                  ))}
                </div>
              </div>

              <div style={s.ff}>
                <label style={s.fl}>📅 Show Dates</label>
                <div style={{display:"flex",gap:"0.5rem",marginTop:"0.3rem"}}>
                  <input type="date" value={newDate} onChange={e=>setNewDate(e.target.value)} style={{...s.fi,flex:1}}/>
                  <button type="button" onClick={addDate} style={{...s.addBtn,padding:"0.5rem 0.9rem"}}>+ Add</button>
                </div>
                <div style={{display:"flex",flexWrap:"wrap",gap:"0.4rem",marginTop:"0.5rem"}}>
                  {form.showDates.map(d => (
                    <span key={d} style={{background:"rgba(124,58,237,0.15)",border:"1px solid #7c3aed",color:"#a78bfa",
                      borderRadius:20,padding:"0.2rem 0.6rem",fontSize:"0.78rem",display:"flex",alignItems:"center",gap:4}}>
                      {d}
                      <button type="button" onClick={() => removeDate(d)} style={{background:"none",border:"none",color:"#e94560",cursor:"pointer",fontSize:"0.8rem",padding:0}}>✕</button>
                    </span>
                  ))}
                </div>
              </div>

              <div style={s.ff}>
                <label style={s.fl}>🖼️ Poster Image</label>
                <input type="file" accept="image/*" onChange={handlePosterChange}
                  style={{color:"#aaa",fontSize:"0.85rem",marginTop:"0.3rem"}}/>
                {posterPreview && (
                  <img src={posterPreview} alt="preview"
                    style={{width:70,height:98,objectFit:"cover",borderRadius:6,marginTop:8}}
                    onError={e=>e.target.style.display="none"}/>
                )}
              </div>

              <div style={{display:"flex",gap:"0.8rem",justifyContent:"flex-end",marginTop:"0.5rem"}}>
                <button type="button" onClick={() => setShowForm(false)} style={s.cancelBtn}>Cancel</button>
                <button type="submit" disabled={formLoading} style={s.submitBtn}>
                  {formLoading ? "Saving..." : editMovie ? "Update Movie" : "Add Movie"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div style={s.overlay} onClick={() => setDeleteConfirm(null)}>
          <div style={{...s.modal,maxWidth:360,textAlign:"center"}} onClick={e=>e.stopPropagation()}>
            <div style={{fontSize:"2.5rem",marginBottom:"0.5rem"}}>🗑️</div>
            <h3 style={{color:"#fff",marginBottom:"0.4rem"}}>Delete Movie?</h3>
            <p style={{color:"#888",fontSize:"0.88rem",marginBottom:"1.5rem"}}>
              "<strong style={{color:"#ccc"}}>{deleteConfirm.title}</strong>" will be permanently removed.
            </p>
            <div style={{display:"flex",gap:"0.8rem",justifyContent:"center"}}>
              <button onClick={() => setDeleteConfirm(null)} style={s.cancelBtn}>Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm._id)} style={{...s.submitBtn,background:"#e94560"}}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const s = {
  page:{display:"flex",minHeight:"100vh",background:"#080810"},
  toast:{position:"fixed",top:20,right:20,zIndex:9999,background:"#1a1a2e",border:"1px solid #2a2a40",
    color:"#f0f0f0",padding:"0.75rem 1.2rem",borderRadius:10,fontSize:"0.9rem",fontWeight:600,
    boxShadow:"0 4px 20px rgba(0,0,0,0.4)"},
  sidebar:{width:210,background:"#0d0d1a",borderRight:"1px solid #1a1a2e",display:"flex",
    flexDirection:"column",padding:"1.5rem 1rem",gap:"0.4rem",position:"sticky",top:0,height:"100vh",flexShrink:0},
  brand:{fontSize:"1.2rem",fontWeight:800,color:"#e94560",marginBottom:"0.4rem"},
  badge:{background:"linear-gradient(135deg,#7c3aed,#2563eb)",color:"#fff",fontSize:"0.68rem",
    fontWeight:700,letterSpacing:"1px",padding:"0.2rem 0.6rem",borderRadius:20,display:"inline-block",marginBottom:"0.2rem"},
  adminName:{color:"#555",fontSize:"0.78rem",marginBottom:"0.8rem"},
  nav:{display:"flex",flexDirection:"column",gap:"0.3rem",flex:1},
  navBtn:{padding:"0.6rem 0.9rem",borderRadius:8,border:"none",background:"transparent",color:"#777",
    fontWeight:600,fontSize:"0.85rem",textAlign:"left",cursor:"pointer"},
  navActive:{background:"rgba(124,58,237,0.15)",color:"#a78bfa"},
  logoutBtn:{padding:"0.55rem 0.9rem",borderRadius:8,border:"1px solid #2a2a40",background:"transparent",
    color:"#555",fontSize:"0.82rem",fontWeight:600,cursor:"pointer",marginTop:"auto"},
  main:{flex:1,padding:"2rem",overflowY:"auto"},
  topBar:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"1.5rem"},
  title:{fontSize:"1.5rem",fontWeight:800,color:"#fff"},
  sub:{color:"#555",fontSize:"0.8rem",marginTop:"0.2rem"},
  addBtn:{padding:"0.55rem 1.1rem",background:"linear-gradient(135deg,#7c3aed,#2563eb)",
    color:"#fff",border:"none",borderRadius:8,fontWeight:700,fontSize:"0.85rem",cursor:"pointer"},
  refreshBtn:{padding:"0.55rem 1rem",background:"transparent",border:"1px solid #2a2a40",
    color:"#aaa",borderRadius:8,fontWeight:600,fontSize:"0.85rem",cursor:"pointer"},
  table:{background:"#0d0d1a",borderRadius:12,border:"1px solid #1a1a2e",overflow:"hidden"},
  thead:{display:"flex",padding:"0.7rem 1rem",background:"#111120",color:"#444",
    fontSize:"0.72rem",fontWeight:700,letterSpacing:"0.5px",borderBottom:"1px solid #1a1a2e"},
  trow:{display:"flex",alignItems:"center",padding:"0.8rem 1rem",borderBottom:"1px solid #111120"},
  empty:{textAlign:"center",color:"#444",padding:"2rem"},
  editBtn:{padding:"0.28rem 0.6rem",background:"rgba(124,58,237,0.15)",border:"1px solid rgba(124,58,237,0.3)",
    color:"#a78bfa",borderRadius:6,fontSize:"0.78rem",cursor:"pointer"},
  delBtn:{padding:"0.28rem 0.55rem",background:"rgba(233,69,96,0.12)",border:"1px solid rgba(233,69,96,0.3)",
    color:"#e94560",borderRadius:6,fontSize:"0.78rem",cursor:"pointer"},
  center:{display:"flex",justifyContent:"center",padding:"3rem"},
  spinner:{width:32,height:32,border:"3px solid #1e1e35",borderTop:"3px solid #7c3aed",
    borderRadius:"50%",display:"inline-block",animation:"spin 0.7s linear infinite"},
  overlay:{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",backdropFilter:"blur(4px)",
    display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:"1rem"},
  modal:{background:"#0d0d1a",border:"1px solid #1e1e35",borderRadius:16,padding:"1.5rem",
    width:"100%",maxWidth:600,maxHeight:"90vh",overflowY:"auto"},
  mhead:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1rem"},
  closeBtn:{background:"none",border:"none",color:"#555",fontSize:"1.1rem",cursor:"pointer"},
  ferr:{background:"rgba(233,69,96,0.12)",border:"1px solid rgba(233,69,96,0.3)",color:"#ff8099",
    borderRadius:8,padding:"0.6rem 0.9rem",fontSize:"0.85rem",marginBottom:"0.8rem"},
  frow:{display:"flex",gap:"0.8rem",flexWrap:"wrap"},
  ff:{display:"flex",flexDirection:"column",gap:"0.3rem",flex:1,minWidth:160},
  fl:{fontSize:"0.76rem",color:"#aaa",fontWeight:600},
  fi:{padding:"0.6rem 0.85rem",borderRadius:8,border:"1px solid #2a2a40",background:"#080810",
    color:"#f0f0f0",fontSize:"0.86rem",outline:"none",width:"100%"},
  cancelBtn:{padding:"0.55rem 1.1rem",background:"transparent",border:"1px solid #2a2a40",
    color:"#777",borderRadius:8,fontWeight:600,fontSize:"0.85rem",cursor:"pointer"},
  submitBtn:{padding:"0.55rem 1.3rem",background:"linear-gradient(135deg,#7c3aed,#2563eb)",
    color:"#fff",border:"none",borderRadius:8,fontWeight:700,fontSize:"0.85rem",cursor:"pointer"},
};
'@Set-Content -Path "frontend/src/pages/AdminDashboard.jsx" -Value $content -Encoding UTF8'