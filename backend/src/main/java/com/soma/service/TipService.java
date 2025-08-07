package com.soma.service;

import com.soma.dto.TipDto;
import com.soma.exception.ResourceNotFoundException;
import com.soma.model.Tip;
import com.soma.repository.TipRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class TipService {
    
    private final TipRepository tipRepository;
    private final ModelMapper modelMapper;
    
    public Tip createTip(TipDto tipDto) {
        Tip tip = modelMapper.map(tipDto, Tip.class);
        return tipRepository.save(tip);
    }
    
    @Transactional(readOnly = true)
    public List<Tip> getAllTips() {
        return tipRepository.findAllByOrderByCreatedAtDesc();
    }
    
    @Transactional(readOnly = true)
    public Tip getTipById(Long id) {
        return tipRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tip not found with id: " + id));
    }
    
    public Tip updateTip(Long id, TipDto tipDto) {
        Tip existingTip = getTipById(id);
        existingTip.setTitle(tipDto.getTitle());
        existingTip.setDescription(tipDto.getDescription());
        return tipRepository.save(existingTip);
    }
    
    public void deleteTip(Long id) {
        if (!tipRepository.existsById(id)) {
            throw new ResourceNotFoundException("Tip not found with id: " + id);
        }
        tipRepository.deleteById(id);
    }
}