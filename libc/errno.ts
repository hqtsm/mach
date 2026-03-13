/**
 * Operation not permitted.
 */
export const EPERM = 1;

/**
 * No such file or directory.
 */
export const ENOENT = 2;

/**
 * No such process.
 */
export const ESRCH = 3;

/**
 * Interrupted system call.
 */
export const EINTR = 4;

/**
 * Input output error.
 */
export const EIO = 5;

/**
 * No such device.
 */
export const ENXIO = 6;

/**
 * Argument list too long.
 */
export const E2BIG = 7;

/**
 * Exec format error.
 */
export const ENOEXEC = 8;

/**
 * Bad file number.
 */
export const EBADF = 9;

/**
 * No child processes.
 */
export const ECHILD = 10;

/**
 * Resource deadlock avoided (11 was EAGAIN).
 */
export const EDEADLK = 11;

/**
 * Cannot allocate memory.
 */
export const ENOMEM = 12;

/**
 * Permission denied.
 */
export const EACCES = 13;

/**
 * Bad address.
 */
export const EFAULT = 14;

/**
 * Block device required.
 */
export const ENOTBLK = 15;

/**
 * Device or resource busy.
 */
export const EBUSY = 16;

/**
 * File exists.
 */
export const EEXIST = 17;

/**
 * Cross-device link.
 */
export const EXDEV = 18;

/**
 * No such device.
 */
export const ENODEV = 19;

/**
 * Not a directory.
 */
export const ENOTDIR = 20;

/**
 * Is a directory.
 */
export const EISDIR = 21;

/**
 * Invalid argument.
 */
export const EINVAL = 22;

/**
 * Too many open files in system.
 */
export const ENFILE = 23;

/**
 * Too many open files.
 */
export const EMFILE = 24;

/**
 * Inappropriate ioctl for device.
 */
export const ENOTTY = 25;

/**
 * Text file busy.
 */
export const ETXTBSY = 26;

/**
 * File too large.
 */
export const EFBIG = 27;

/**
 * No space left on device.
 */
export const ENOSPC = 28;

/**
 * Illegal seek.
 */
export const ESPIPE = 29;

/**
 * Read-only file system.
 */
export const EROFS = 30;

/**
 * Too many links.
 */
export const EMLINK = 31;

/**
 * Broken pipe.
 */
export const EPIPE = 32;

/**
 * Math arg out of domain.
 */
export const EDOM = 33;

/**
 * Math result too large.
 */
export const ERANGE = 34;

/**
 * Resource temporarily unavailable.
 */
export const EAGAIN = 35;

/**
 * Operation would block.
 */
export const EWOULDBLOCK = EAGAIN;

/**
 * Operation now in progress.
 */
export const EINPROGRESS = 36;

/**
 * Operation already in progress.
 */
export const EALREADY = 37;

/**
 * Socket operation on non-socket.
 */
export const ENOTSOCK = 38;

/**
 * Destination address required.
 */
export const EDESTADDRREQ = 39;

/**
 * Message too long.
 */
export const EMSGSIZE = 40;

/**
 * Protocol wrong type for socket.
 */
export const EPROTOTYPE = 41;

/**
 * Protocol not available.
 */
export const ENOPROTOOPT = 42;

/**
 * Protocol not supported.
 */
export const EPROTONOSUPPORT = 43;

/**
 * Socket type not supported.
 */
export const ESOCKTNOSUPPORT = 44;

/**
 * Operation not supported.
 */
export const ENOTSUP = 45;

/**
 * Protocol family not supported.
 */
export const EPFNOSUPPORT = 46;

/**
 * Address family not supported by protocol.
 */
export const EAFNOSUPPORT = 47;

/**
 * Address already in use.
 */
export const EADDRINUSE = 48;

/**
 * Cannot assign requested address.
 */
export const EADDRNOTAVAIL = 49;

/**
 * Network is down.
 */
export const ENETDOWN = 50;

/**
 * Network is unreachable.
 */
export const ENETUNREACH = 51;

/**
 * Network dropped connection on reset.
 */
export const ENETRESET = 52;

/**
 * Software caused connection abort.
 */
export const ECONNABORTED = 53;

/**
 * Connection reset by peer.
 */
export const ECONNRESET = 54;

/**
 * No buffer space available.
 */
export const ENOBUFS = 55;

/**
 * Socket is already connected.
 */
export const EISCONN = 56;

/**
 * Socket is not connected.
 */
export const ENOTCONN = 57;

/**
 * Cannot send after socket shutdown.
 */
export const ESHUTDOWN = 58;

/**
 * Too many references: cannot splice.
 */
export const ETOOMANYREFS = 59;

/**
 * Operation timed out.
 */
export const ETIMEDOUT = 60;

/**
 * Connection refused.
 */
export const ECONNREFUSED = 61;

/**
 * Too many levels of symbolic links.
 */
export const ELOOP = 62;

/**
 * File name too long.
 */
export const ENAMETOOLONG = 63;

/**
 * Host is down.
 */
export const EHOSTDOWN = 64;

/**
 * No route to host.
 */
export const EHOSTUNREACH = 65;

/**
 * Directory not empty.
 */
export const ENOTEMPTY = 66;

/**
 * Too many processes.
 */
export const EPROCLIM = 67;

/**
 * Too many users.
 */
export const EUSERS = 68;

/**
 * Disc quota exceeded.
 */
export const EDQUOT = 69;

/**
 * Stale NFS file handle.
 */
export const ESTALE = 70;

/**
 * Too many levels of remote in path.
 */
export const EREMOTE = 71;

/**
 * RPC struct is bad.
 */
export const EBADRPC = 72;

/**
 * RPC version wrong.
 */
export const ERPCMISMATCH = 73;

/**
 * RPC program not avail.
 */
export const EPROGUNAVAIL = 74;

/**
 * Program version wrong.
 */
export const EPROGMISMATCH = 75;

/**
 * Bad procedure for program.
 */
export const EPROCUNAVAIL = 76;

/**
 * No locks available.
 */
export const ENOLCK = 77;

/**
 * Function not implemented.
 */
export const ENOSYS = 78;

/**
 * Inappropriate file type or format.
 */
export const EFTYPE = 79;

/**
 * Authentication error.
 */
export const EAUTH = 80;

/**
 * Need authenticator.
 */
export const ENEEDAUTH = 81;

/**
 * Device powered off.
 */
export const EPWROFF = 82;

/**
 * Device error.
 */
export const EDEVERR = 83;

/**
 * Value too large to be stored in data type.
 */
export const EOVERFLOW = 84;

/**
 * Bad executable.
 */
export const EBADEXEC = 85;

/**
 * Bad CPU type in executable.
 */
export const EBADARCH = 86;

/**
 * Shared library version mismatch.
 */
export const ESHLIBVERS = 87;

/**
 * Malformed Mach-O file.
 */
export const EBADMACHO = 88;

/**
 * Operation canceled.
 */
export const ECANCELED = 89;

/**
 * Identifier removed.
 */
export const EIDRM = 90;

/**
 * No message of desired type.
 */
export const ENOMSG = 91;

/**
 * Illegal byte sequence.
 */
export const EILSEQ = 92;

/**
 * Attribute not found.
 */
export const ENOATTR = 93;

/**
 * Bad message.
 */
export const EBADMSG = 94;

/**
 * Multihop attempted.
 */
export const EMULTIHOP = 95;

/**
 * No message available on STREAM.
 */
export const ENODATA = 96;

/**
 * Link has been severed.
 */
export const ENOLINK = 97;

/**
 * No stream resources.
 */
export const ENOSR = 98;

/**
 * Not a stream.
 */
export const ENOSTR = 99;

/**
 * Protocol error.
 */
export const EPROTO = 100;

/**
 * Stream timeout.
 */
export const ETIME = 101;

/**
 * Operation not supported.
 */
export const EOPNOTSUPP = 102;

/**
 * Policy not supported.
 */
export const ENOPOLICY = 103;

/**
 * Not recoverable.
 */
export const ENOTRECOVERABLE = 104;

/**
 * Owner died.
 */
export const EOWNERDEAD = 105;

/**
 * Interface output queue is full.
 */
export const EQFULL = 106;

/**
 * Capability not available.
 */
export const ENOTCAPABLE = 107;

/**
 * Largest errno.
 */
export const ELAST = 107;
