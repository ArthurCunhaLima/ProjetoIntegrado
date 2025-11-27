package com.projeto.projeto.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import org.springframework.stereotype.Service;

@Service
public class QRCodeService {

    public String gerarQRCodeBase64(String conteudo, int largura, int altura) throws Exception {
        QRCodeWriter writer = new QRCodeWriter();
        BitMatrix bitMatrix = writer.encode(conteudo, BarcodeFormat.QR_CODE, largura, altura);
        
        Path tempFile = Files.createTempFile("qrcode", ".png");
        MatrixToImageWriter.writeToPath(bitMatrix, "PNG", tempFile);
        
        byte[] imageBytes = Files.readAllBytes(tempFile);
        Files.delete(tempFile);
        
        return Base64.getEncoder().encodeToString(imageBytes);
    }

    public String gerarQRCodeDataUrl(String conteudo, int largura, int altura) throws Exception {
        String base64 = gerarQRCodeBase64(conteudo, largura, altura);
        return "data:image/png;base64," + base64;
    }
}
