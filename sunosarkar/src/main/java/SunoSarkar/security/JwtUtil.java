package SunoSarkar.security;

import SunoSarkar.enums.Roles;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {
    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration}")
    private Long expiration;

    private Key getsigningKey(){
        return Keys.hmacShaKeyFor(secretKey.getBytes());
    }
    public String generateToken(String email, String role){
        return Jwts.builder().
                setSubject(email)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis()+expiration))
                        .signWith(getsigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }
    public Claims getClaims(String token){
        return Jwts.parserBuilder()
                .setSigningKey(getsigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
    public String extractEmail(String token){
        return getClaims(token).getSubject();
    }
    public String getRole(String token){
        return getClaims(token).get("role", String.class);
    }
    public boolean isTokenValid(String token){
        try {
            getClaims(token);
            return true;
        }catch (JwtException | IllegalArgumentException e){
            return false;
        }
    }
}
